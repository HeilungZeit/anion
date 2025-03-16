import { NgForOf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TuiDataList } from '@taiga-ui/core';
import { TuiSelectModule } from '@taiga-ui/legacy';
import { PlayerIframeComponent } from '../anime-player-iframe/anime-player-iframe.component';
import {
  IndexDbService,
  WatchedEpisode,
} from '../../../../services/indexDb/index-db.service';
import { distinctUntilChanged, interval, map, takeWhile } from 'rxjs';

interface Episode {
  episode: number;
  iframeUrl: string;
  id: string;
}

interface VideoData {
  data: {
    dubbing: string;
    player: string;
  };
  number: number;
  iframeUrl: string;
  videoId: string;
}

@Component({
  selector: 'ani-player',
  imports: [
    FormsModule,
    NgForOf,
    TuiDataList,
    TuiSelectModule,
    PlayerIframeComponent,
  ],
  templateUrl: './anime-player.component.html',
  styleUrl: './anime-player.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnimePlayerComponent implements OnInit {
  readonly videos = input<VideoData[]>([]);
  readonly animeId = input.required<number>();

  selectedDubber = signal<string>('');
  selectedPlayer = signal<string>('');
  selectedEpisode = signal<Episode | null>(null);
  indexDbWatchedEpisodes = signal<WatchedEpisode[]>([]);

  protected indexDbService = inject(IndexDbService);

  constructor() {
    interval(500)
      .pipe(
        map(() => this.indexDbService.checkDbInit()),
        distinctUntilChanged(),
        takeWhile((isInitialized) => !isInitialized, true)
      )
      .subscribe(async (isInitialized) => {
        if (isInitialized) {
          await this.initializeLastWatchedEpisode();
        }
      });

    effect(() => {
      const dubber = this.selectedDubber();
      if (dubber) {
        const playersData = this.playersDataWithEpisodesCache()?.[dubber];
        const firstPlayer = Object.keys(playersData || {}).find(
          (key) => !key.endsWith('-count')
        );

        if (firstPlayer) {
          this.selectedPlayer.set(firstPlayer);
        }
      }
    });

    effect(() => {
      const dubber = this.selectedDubber();
      const player = this.selectedPlayer();

      if (dubber && player) {
        const playersData = this.playersDataWithEpisodesCache()?.[dubber];
        this.selectedEpisode.set(playersData?.[player]?.[0]);

        this.indexDbService.markEpisodeAsWatched(
          this.animeId(),
          playersData?.[player]?.[0]?.episode || 1,
          dubber,
          player
        );

        this.indexDbService
          .getWatchedEpisodes(this.animeId(), dubber, player)
          .then((watchedEpisodes) => {
            this.indexDbWatchedEpisodes.set(watchedEpisodes);
          });
      }
    });
  }

  ngOnInit() {
    if (this.videos()?.length > 0) {
      const dubbers = this.dubbersData().dubbers;
      if (dubbers.length > 0) {
        const firstDubber = dubbers[0];

        this.selectedDubber.set(firstDubber);

        const playersData = this.playersDataWithEpisodesCache()[firstDubber];
        const firstPlayer = Object.keys(playersData).filter(
          (key) => !key.endsWith('-count')
        )[0];

        this.selectedPlayer.set(firstPlayer);
        this.selectedEpisode.set(playersData?.[firstPlayer]?.[0]);
      }
    }
  }

  private async initializeLastWatchedEpisode(): Promise<void> {
    const lastWatchedEpisode =
      (await this.indexDbService.getWatchedEpisodes(this.animeId())) || null;
    const lastEpisodeLength = lastWatchedEpisode?.length || 0;

    if (!lastWatchedEpisode) return;

    const lastEpisodeData = lastWatchedEpisode[lastEpisodeLength - 1];
    this.selectedDubber.set(lastEpisodeData.dubber);
    this.selectedPlayer.set(lastEpisodeData.player);

    const playersData =
      this.playersDataWithEpisodesCache()[lastEpisodeData.dubber];
    this.selectedEpisode.set(
      playersData?.[lastEpisodeData.player]?.find(
        (episode: Episode) => episode.episode === lastEpisodeData.episode
      )
    );
  }

  protected setSelectedEpisode(episode: Episode): void {
    this.selectedEpisode.set(episode);

    this.indexDbService.markEpisodeAsWatched(
      this.animeId(),
      episode.episode || 1,
      this.selectedDubber(),
      this.selectedPlayer()
    );

    this.indexDbService
      .getWatchedEpisodes(
        this.animeId(),
        this.selectedDubber(),
        this.selectedPlayer()
      )
      .then((watchedEpisodes) => {
        this.indexDbWatchedEpisodes.set(watchedEpisodes);
      });
  }

  private readonly watchedEpisodesMap = computed(() => {
    const map = new Map<string, boolean>();
    const watchedEpisodes = this.indexDbWatchedEpisodes();
    const currentDubber = this.selectedDubber();
    const currentPlayer = this.selectedPlayer();

    watchedEpisodes.forEach((watchedEpisode) => {
      const key = `${watchedEpisode.episode}_${currentDubber}_${currentPlayer}`;
      map.set(key, true);
    });

    return map;
  });

  protected isEpisodeWatched(episode: Episode): boolean {
    const key = `${
      episode.episode
    }_${this.selectedDubber()}_${this.selectedPlayer()}`;
    return this.watchedEpisodesMap().has(key);
  }

  private readonly playersDataWithEpisodesCache = computed(() =>
    this.getPlayersDataWithEpisodes(this.videos())
  );

  readonly playersData = computed(() =>
    this.getPlayersData(this.playersDataWithEpisodesCache())
  );

  readonly playersDataWithEpisodes = computed(() =>
    this.playersDataWithEpisodesCache()
  );

  readonly dubberEpisodesCount = (dubber: string) => {
    const counts = Object.keys(
      this.playersDataWithEpisodesCache()?.[dubber] || {}
    )?.filter((key) => key.endsWith('-count'));

    const maxCount = Math.max(
      ...counts.map(
        (count) => this.playersDataWithEpisodesCache()[dubber][count]
      )
    );

    return `(${maxCount} эп.)`;
  };

  readonly playerEpisodesCount = (dubber: string, player: string) => {
    const counts = this.playersDataWithEpisodesCache()?.[dubber]?.[player];

    return `(${counts?.length || 0} эп.)`;
  };

  readonly dubbersData = computed(() => this.getDubbersData(this.videos()));

  private getDubbersData(videos: VideoData[]): {
    dubbers: string[];
    subtitles: string[];
  } {
    return videos.reduce(
      (acc, { data: { dubbing } }) => {
        const dubbingLower = dubbing.toLowerCase();
        const isDubber =
          dubbingLower.startsWith('озвучка') ||
          !dubbingLower.startsWith('субтитры');

        if (!acc.dubbersSet.has(dubbing)) {
          (isDubber ? acc.dubbers : acc.subtitles).push(dubbing);
          acc.dubbersSet.add(dubbing);
        }

        return acc;
      },
      {
        dubbers: [] as any[],
        subtitles: [] as any[],
        dubbersSet: new Set<string>(),
      }
    );
  }

  private getPlayersData(videos: { [k: string]: any }) {
    const mapOfPlayers = new Set<string>();

    Object.keys(videos[this.selectedDubber()]).forEach((key) => {
      if (!key.endsWith('-count')) {
        mapOfPlayers.add(key);
      }
    });

    return Array.from(mapOfPlayers);
  }

  private getPlayersDataWithEpisodes(videos: VideoData[]) {
    return videos.reduce((acc, video) => {
      if (video.data.player === 'Плеер Aksor') return acc;

      const {
        data: { dubbing, player },
        number,
        iframeUrl,
        videoId,
      } = video;

      if (!acc[dubbing]) {
        acc[dubbing] = { [`${player}-count`]: number };
      }

      const dubbingData = acc[dubbing];

      if (!dubbingData[player]) {
        dubbingData[player] = [];
      }

      dubbingData[player].push({ episode: number, iframeUrl, id: videoId });
      dubbingData[player].sort((a: any, b: any) => a.episode - b.episode);

      dubbingData[`${player}-count`] = Math.max(
        dubbingData[`${player}-count`] || 0,
        number
      );

      return acc;
    }, {} as Record<string, any>);
  }
}
