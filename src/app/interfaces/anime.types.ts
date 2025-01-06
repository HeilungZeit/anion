export interface AnimeDetailsI {
  animeId: string;
  episodes: AnimeEpisodesI;
  animeStatus: AnimeStatusI;
  minAge: { titleLong: string };
  rating: { average: number };
  randomScreenshots: Array<{ sizes: { full: string; medium: string } }>;
  videos: any[];
  fandubbers: any[];
  genres: any[];
  otherTitles: string[];
  description: string;
  year: number;
  title: string;
  viewingOrder: BasicAnimeI[];
  poster: AnimePosterI;
  type: AnimeTypeI;
  views?: number;
}

export interface AnimeEpisodesI {
  aired: number;
  count: number;
  nextDate?: number;
}

export interface AnimePosterI {
  fullsize: string;
  medium: string;
  big: string;
  huge: string;
  small: string;
}

export interface InfoItemI {
  id: string;
  value: string | number;
  title: string;
  icon: string;
}

export interface AnimeStatusI {
  alias: string;
  class: string;
  title: string;
  value: string | number;
}

export interface AnimeTypeI {
  name: string;
  shortname: string;
  value: string | number;
}

export interface BasicAnimeI {
  animeId: string;
  animeStatus: AnimeStatusI;
  animeUrl: string;
  data: {
    id: string | number;
    index: number;
    text: string;
  };
  poster: AnimePosterI;
  description: string;
  rating: number;
  title: string;
  type: AnimeTypeI;
  year: number;
}

export interface GenreGroup {
  title: string;
  id: number;
}

export interface GenreResponse<T> {
  title: string;
  href: string;
  value: number | T;
  more_titles: string[];
  group_id: number;
}

export interface GenresResponse {
  genres: GenreResponse<number>[];
  groups: GenreGroup[];
}
