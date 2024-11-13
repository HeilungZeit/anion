import { NgForOf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TuiDataList } from '@taiga-ui/core';
import { TuiSelectModule } from '@taiga-ui/legacy';
import { PlayerIframeComponent } from '../anime-player-iframe/anime-player-iframe.component';

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
  standalone: true,
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
  selectedDubber = signal<string>('');
  selectedPlayer = signal<string>('');
  selectedEpisode = signal<Episode | null>(null);

  constructor(private sanitizer: DomSanitizer) {}

  readonly videos = input<VideoData[]>([]);

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

        this.selectedEpisode.set(playersData[firstPlayer][0]);
      }
    }
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

  readonly dubbersData = computed(() => this.getDubbersData(this.videos()));

  readonly currentEpisodeUrl = computed(() => {
    const episode = this.selectedEpisode();
    return episode ? this.getSafeUrl(episode.iframeUrl) : null;
  });

  getSafeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  private getDubbersData(videos: VideoData[]): {
    dubbers: string[];
    subtitles: string[];
  } {
    const mapOfDubbers = new Map<string, VideoData>();
    videos.forEach((video) => {
      mapOfDubbers.set(video.data.dubbing, video);
    });

    return {
      dubbers: Array.from(mapOfDubbers.keys()).filter((dubber) =>
        dubber.toLowerCase().startsWith('озвучка')
      ),
      subtitles: Array.from(mapOfDubbers.keys()).filter((dubber) =>
        dubber.toLowerCase().startsWith('субтитры')
      ),
    };
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
    const mapOfPlayers = new Map<string, any>();

    videos.forEach((video) => {
      if (!mapOfPlayers.get(video.data.dubbing)) {
        mapOfPlayers.set(video.data.dubbing, {
          [`${video.data.player}-count`]: video.number,
        });
      }

      const dubbingData = mapOfPlayers.get(video.data.dubbing);
      if (!dubbingData[video.data.player]) {
        dubbingData[video.data.player] = [];
      }

      dubbingData[video.data.player].push({
        episode: video.number,
        iframeUrl: video.iframeUrl,
        id: video.videoId,
      });

      const currentCount = dubbingData[`${video.data.player}-count`] || 0;
      dubbingData[`${video.data.player}-count`] = Math.max(
        currentCount,
        video.number
      );
    });

    return Object.fromEntries(mapOfPlayers);
  }
}
