import { inject, Injectable } from '@angular/core';
import { AxiosService } from '../axios/axios.service';
import { AnimeQueryI } from '../../interfaces/queries.types';
import { GenresResponse } from '../../interfaces/anime.types';

@Injectable({
  providedIn: 'root',
})
export class YumiService {
  private axiosService = inject(AxiosService);

  async getAnime(id: number): Promise<any> {
    return this.axiosService.get(`/anime/${id}`);
  }

  async getFeed(): Promise<any> {
    return this.axiosService.get('anime/feed');
  }

  async getRecommendations(id: number): Promise<any> {
    return this.axiosService.get(`/anime/${id}/recommendations`);
  }

  async getAnimeWithQuery(query: AnimeQueryI): Promise<any> {
    const params = {} as any;

    Object.entries(query).forEach(([key, value]) => {
      if (
        value === null ||
        value === undefined ||
        value === '' ||
        (Array.isArray(value) && value.length === 0)
      ) {
        return;
      }

      if (Array.isArray(value)) {
        params[key] = value.join(',');
      } else {
        params[key] = value;
      }
    });

    if (!query.limit) {
      params.limit = 20;
    }

    return this.axiosService.get(`/anime`, params);
  }

  async getGenres(): Promise<GenresResponse> {
    return this.axiosService.get('/anime/genres');
  }

  async searchAnime(payload: {
    search: string;
    offset?: number;
    limit?: number;
  }): Promise<any> {
    return this.axiosService.post('/anime/search', payload);
  }
}
