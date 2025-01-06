type RequiredFileds =
  | 'creators'
  | 'studios'
  | 'original'
  | 'description'
  | 'min_age'
  | 'season'
  | 'genres'
  | 'ep_count'
  | 'translates';

type Season = 'winter' | 'spring' | 'summer' | 'fall' | 'autumn';
export type Status = 'ongoing' | 'released' | 'announce' | 'announcement';
type Translates =
  | 'full'
  | 'dubbing'
  | 'multivoice'
  | 'onevoice'
  | 'single'
  | 'twovoice'
  | 'duet'
  | 'subtitles';
export type Types =
  | 'tv'
  | 'movie'
  | 'shortfilm'
  | 'ova'
  | 'special'
  | 'shorttv'
  | 'ona';
export type Sort =
  | 'title'
  | 'year'
  | 'rating'
  | 'rating_counters'
  | 'views'
  | 'top'
  | 'random'
  | 'id';

export interface AnimeQueryI {
  minAge?: number;
  maxRatingCounters?: number;
  minRatingAverage?: number;
  requireFields?: RequiredFileds;
  ids?: number[];
  season?: Season[];
  status?: Status[];
  translates?: Translates[];
  types?: Types[];
  excludeGenres?: string[];
  genres?: string[];
  maxRating?: number;
  minRating?: number;
  epTo?: number;
  epFrom?: number;
  toYear?: number;
  fromYear?: number;
  sortForward?: boolean;
  sort?: Sort;
  limit?: number;
  offset: number;
}

export type GenericSelectItems<T> = {
  value: T;
  title: string;
};
