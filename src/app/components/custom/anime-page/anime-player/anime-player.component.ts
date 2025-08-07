import { NgForOf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  signal,
  viewChild,
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

const SCROLL_SPEED_MULTIPLIER = 4;
const TOUCH_SENSITIVITY = 1.2;
const SCROLL_DELAY = 150;
const DB_CHECK_INTERVAL = 400;

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
export class AnimePlayerComponent implements OnInit, OnDestroy {
  readonly videos = input<VideoData[]>([]);
  readonly animeId = input.required<number>();

  selectedDubber = signal<string>('');
  selectedPlayer = signal<string>('');
  selectedEpisode = signal<Episode | null>(null);
  indexDbWatchedEpisodes = signal<WatchedEpisode[]>([]);
  indexDbInitialized = signal<boolean>(false);

  episodesWrapper = viewChild<ElementRef>('episodesWrapper');

  protected indexDbService = inject(IndexDbService);
  private eventListeners: Array<() => void> = [];

  // Main computed data
  readonly playersDataWithEpisodes = computed(() =>
    this.getPlayersDataWithEpisodes(this.videos())
  );

  readonly dubbersData = computed(() => this.getDubbersData(this.videos()));

  readonly playersData = computed(() => {
    const dubber = this.selectedDubber();
    const data = this.playersDataWithEpisodes()?.[dubber];
    return data
      ? Object.keys(data).filter((key) => !key.endsWith('-count'))
      : [];
  });

  // Current episodes and navigation
  readonly currentEpisodes = computed(() => {
    const dubber = this.selectedDubber();
    const player = this.selectedPlayer();
    return this.playersDataWithEpisodes()?.[dubber]?.[player] || [];
  });

  readonly currentEpisodeIndex = computed(() => {
    const episodes = this.currentEpisodes();
    const current = this.selectedEpisode();
    return episodes.findIndex((ep: Episode) => ep.id === current?.id);
  });

  readonly hasNextEpisode = computed(() => {
    const index = this.currentEpisodeIndex();
    return index >= 0 && index < this.currentEpisodes().length - 1;
  });

  readonly hasPreviousEpisode = computed(() => this.currentEpisodeIndex() > 0);

  readonly currentEpisodesCount = computed(() => this.currentEpisodes().length);

  readonly watchedEpisodesMap = computed(() => {
    const map = new Map<string, boolean>();
    const watched = this.indexDbWatchedEpisodes();
    const dubber = this.selectedDubber();
    const player = this.selectedPlayer();

    watched.forEach((episode) => {
      map.set(`${episode.episode}_${dubber}_${player}`, true);
    });

    return map;
  });

  constructor() {
    this.initializeIndexDb();
    this.setupEffects();
  }

  private initializeIndexDb(): void {
    interval(DB_CHECK_INTERVAL)
      .pipe(
        map(() => this.indexDbService.checkDbInit()),
        distinctUntilChanged(),
        takeWhile((isInitialized) => !isInitialized, true)
      )
      .subscribe(async (isInitialized) => {
        if (isInitialized) {
          await this.initializeLastWatchedEpisode();
          this.indexDbInitialized.set(true);
        }
      });
  }

  private setupEffects(): void {
    // Reset state when videos change
    effect(() => {
      const videos = this.videos();
      if (videos.length > 0) {
        const dubbers = this.dubbersData().dubbers;
        if (dubbers.length > 0 && !this.selectedDubber()) {
          this.selectedDubber.set(dubbers[0]);
        }
      }
    });

    // Auto-select first player when dubber changes
    effect(() => {
      const dubber = this.selectedDubber();
      const players = this.playersData();
      const currentPlayer = this.selectedPlayer();

      if (
        dubber &&
        players.length > 0 &&
        (!currentPlayer || !players.includes(currentPlayer))
      ) {
        this.selectedPlayer.set(players[0]);
      }
    });

    // Auto-select first episode when episodes change
    effect(() => {
      const dubber = this.selectedDubber();
      const player = this.selectedPlayer();
      const episodes = this.currentEpisodes();

      if (dubber && player && episodes.length > 0) {
        // Check if current episode exists in new episodes list
        const currentEpisode = this.selectedEpisode();
        const episodeExists =
          currentEpisode &&
          episodes.some((ep: Episode) => ep.id === currentEpisode.id);

        if (!episodeExists) {
          const firstEpisode = episodes[0];
          this.selectedEpisode.set(firstEpisode);
          this.markEpisodeAsWatched(firstEpisode);
        }
      }
    });

    // Update watched episodes when dubber/player changes
    effect(async () => {
      const dubber = this.selectedDubber();
      const player = this.selectedPlayer();

      if (this.indexDbInitialized() && dubber && player) {
        const watched = await this.indexDbService.getWatchedEpisodes(
          this.animeId(),
          dubber,
          player
        );
        this.indexDbWatchedEpisodes.set(watched);
      }
    });

    // Auto-scroll and setup horizontal scroll
    effect(() => {
      const episode = this.selectedEpisode();
      const episodes = this.currentEpisodes();

      if (episode && episodes.length > 0 && this.indexDbInitialized()) {
        this.clearEventListeners();
        setTimeout(() => {
          this.scrollToEpisode(episode);
          this.setupHorizontalScroll();
        }, SCROLL_DELAY);
      }
    });
  }

  ngOnInit(): void {
    if (this.videos()?.length > 0) {
      const dubbers = this.dubbersData().dubbers;
      if (dubbers.length > 0) {
        this.selectedDubber.set(dubbers[0]);
      }
    }
  }

  ngOnDestroy(): void {
    this.clearEventListeners();
  }

  private clearEventListeners(): void {
    this.eventListeners.forEach((cleanup) => cleanup());
    this.eventListeners = [];
  }

  private addEventListenerWithCleanup(
    element: HTMLElement,
    event: string,
    handler: (event: any) => void,
    options?: boolean | AddEventListenerOptions
  ): void {
    element.addEventListener(event, handler, options);
    this.eventListeners.push(() => {
      if (element.isConnected) {
        element.removeEventListener(event, handler, options);
      }
    });
  }

  private setupHorizontalScroll(): void {
    const episodesElement = this.episodesWrapper()?.nativeElement;
    if (!episodesElement?.isConnected) return;

    episodesElement.setAttribute('tabindex', '-1');

    // Mouse events
    this.addEventListenerWithCleanup(episodesElement, 'mouseenter', () => {
      episodesElement.focus({ preventScroll: true });
    });

    // Wheel scroll (vertical to horizontal conversion)
    this.addEventListenerWithCleanup(
      episodesElement,
      'wheel',
      (e: WheelEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const scrollAmount =
          Math.abs(e.deltaY) > Math.abs(e.deltaX)
            ? e.deltaY * SCROLL_SPEED_MULTIPLIER
            : e.deltaX * 2;

        episodesElement.scrollLeft += scrollAmount;
      },
      { passive: false, capture: true }
    );

    // Touch gestures
    this.setupTouchScroll(episodesElement);
  }

  private setupTouchScroll(element: HTMLElement): void {
    let startX = 0;
    let startScrollLeft = 0;

    this.addEventListenerWithCleanup(
      element,
      'touchstart',
      (e: TouchEvent) => {
        e.stopPropagation();
        startX = e.touches[0].clientX;
        startScrollLeft = element.scrollLeft;
      },
      { passive: false }
    );

    this.addEventListenerWithCleanup(
      element,
      'touchmove',
      (e: TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const deltaX = (startX - e.touches[0].clientX) * TOUCH_SENSITIVITY;
        element.scrollLeft = startScrollLeft + deltaX;
      },
      { passive: false }
    );

    this.addEventListenerWithCleanup(
      element,
      'touchend',
      (e: TouchEvent) => {
        e.stopPropagation();
      },
      { passive: true }
    );
  }

  private async initializeLastWatchedEpisode(): Promise<void> {
    const lastWatchedEpisodes = await this.indexDbService.getWatchedEpisodes(
      this.animeId()
    );
    if (!lastWatchedEpisodes?.length) return;

    const lastEpisode = lastWatchedEpisodes[lastWatchedEpisodes.length - 1];

    this.selectedDubber.set(lastEpisode.dubber);
    this.selectedPlayer.set(lastEpisode.player);

    // Find and set the target episode
    setTimeout(() => {
      const episodes =
        this.playersDataWithEpisodes()[lastEpisode.dubber]?.[
          lastEpisode.player
        ];
      const targetEpisode = episodes?.find(
        (ep: Episode) => ep.episode === lastEpisode.episode
      );

      if (targetEpisode) {
        this.selectedEpisode.set(targetEpisode);
      }
    }, 100);
  }

  protected setSelectedEpisode(episode: Episode): void {
    this.selectedEpisode.set(episode);
    this.markEpisodeAsWatched(episode);
    this.updateWatchedEpisodes();
  }

  private markEpisodeAsWatched(episode: Episode): void {
    this.indexDbService.markEpisodeAsWatched(
      this.animeId(),
      episode.episode || 1,
      this.selectedDubber(),
      this.selectedPlayer()
    );
  }

  private async updateWatchedEpisodes(): Promise<void> {
    const watched = await this.indexDbService.getWatchedEpisodes(
      this.animeId(),
      this.selectedDubber(),
      this.selectedPlayer()
    );
    this.indexDbWatchedEpisodes.set(watched);
  }

  // Navigation methods
  protected goToNextEpisode(): void {
    const episodes = this.currentEpisodes();
    const currentIndex = this.currentEpisodeIndex();

    if (currentIndex >= 0 && currentIndex < episodes.length - 1) {
      this.setSelectedEpisode(episodes[currentIndex + 1]);
    }
  }

  protected goToPreviousEpisode(): void {
    const episodes = this.currentEpisodes();
    const currentIndex = this.currentEpisodeIndex();

    if (currentIndex > 0) {
      this.setSelectedEpisode(episodes[currentIndex - 1]);
    }
  }

  protected jumpToEpisode(event: Event): void {
    const episodeNumber = parseInt((event.target as HTMLInputElement).value);
    if (isNaN(episodeNumber)) return;

    const targetEpisode = this.currentEpisodes().find(
      (ep: Episode) => ep.episode === episodeNumber
    );

    if (targetEpisode) {
      this.setSelectedEpisode(targetEpisode);
    }
  }

  private scrollToEpisode(episode: Episode): void {
    const attemptScroll = (attempt: number = 0): void => {
      const wrapper = this.episodesWrapper()?.nativeElement;
      const container = wrapper?.querySelector('.episodes-scroll-container');
      const element = container?.querySelector(
        `[data-episode="${episode.episode}"]`
      ) as HTMLElement;

      if (wrapper && element) {
        const scrollPosition =
          element.offsetLeft -
          wrapper.clientWidth / 2 +
          element.offsetWidth / 2;
        wrapper.scrollTo({
          left: Math.max(0, scrollPosition),
          behavior: 'smooth',
        });
      } else if (attempt < 3) {
        setTimeout(() => attemptScroll(attempt + 1), 100 * (attempt + 1));
      }
    };

    setTimeout(() => attemptScroll(), SCROLL_DELAY);
  }

  // Helper methods
  protected isEpisodeWatched(episode: Episode): boolean {
    const key = `${
      episode.episode
    }_${this.selectedDubber()}_${this.selectedPlayer()}`;
    return this.watchedEpisodesMap().has(key);
  }

  readonly dubberEpisodesCount = (dubber: string): string => {
    const data = this.playersDataWithEpisodes()?.[dubber] || {};
    const counts = Object.keys(data).filter((key) => key.endsWith('-count'));
    if (counts.length === 0) return '(0 эп.)';

    const maxCount = Math.max(...counts.map((count) => data[count]));
    return `(${maxCount} эп.)`;
  };

  readonly playerEpisodesCount = (dubber: string, player: string): string => {
    const episodes = this.playersDataWithEpisodes()?.[dubber]?.[player];
    return `(${episodes?.length || 0} эп.)`;
  };

  private getDubbersData(videos: VideoData[]): {
    dubbers: string[];
    subtitles: string[];
  } {
    const dubbers: string[] = [];
    const subtitles: string[] = [];
    const seen = new Set<string>();

    videos.forEach(({ data: { dubbing } }) => {
      if (seen.has(dubbing)) return;

      const isSubtitle = dubbing.toLowerCase().startsWith('субтитры');
      (isSubtitle ? subtitles : dubbers).push(dubbing);
      seen.add(dubbing);
    });

    return { dubbers, subtitles };
  }

  private getPlayersDataWithEpisodes(videos: VideoData[]): Record<string, any> {
    return videos.reduce((acc, video) => {
      if (video.data.player === 'Плеер Aksor') return acc;

      const {
        data: { dubbing, player },
        number,
        iframeUrl,
        videoId,
      } = video;

      // Initialize dubbing data
      if (!acc[dubbing]) {
        acc[dubbing] = { [`${player}-count`]: number };
      }

      // Initialize player episodes array
      if (!acc[dubbing][player]) {
        acc[dubbing][player] = [];
      }

      // Add episode and sort
      acc[dubbing][player].push({ episode: number, iframeUrl, id: videoId });
      acc[dubbing][player].sort((a: any, b: any) => a.episode - b.episode);

      // Update count
      acc[dubbing][`${player}-count`] = Math.max(
        acc[dubbing][`${player}-count`] || 0,
        number
      );

      return acc;
    }, {} as Record<string, any>);
  }
}
