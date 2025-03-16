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
    try {
      return await this.axiosService.get(`/anime/${id}`);
    } catch (error) {
      console.error('Ошибка при получении аниме:', error);
      throw error;
    }
  }

  async getFeed(): Promise<any> {
    try {
      return await this.axiosService.get('anime/feed');
    } catch (error) {
      console.error('Ошибка при получении ленты:', error);
      throw error;
    }
  }

  async getRecommendations(id: number): Promise<any> {
    try {
      return await this.axiosService.get(`/anime/${id}/recommendations`);
    } catch (error) {
      console.error('Ошибка при получении рекомендаций:', error);
      throw error;
    }
  }

  async getAnimeWithQuery(query: AnimeQueryI): Promise<any> {
    try {
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

      return await this.axiosService.get(`/anime`, params);
    } catch (error) {
      console.error('Ошибка при поиске аниме:', error);
      throw error;
    }
  }

  async getGenres(): Promise<GenresResponse> {
    try {
      return await this.axiosService.get('/anime/genres');
    } catch (error) {
      console.error('Ошибка при получении жанров:', error);
      throw error;
    }
  }

  async searchAnime(payload: {
    search: string;
    offset?: number;
    limit?: number;
  }): Promise<any> {
    try {
      return await this.axiosService.post('/anime/search', payload);
    } catch (error) {
      console.error('Ошибка при поиске аниме:', error);
      throw error;
    }
  }
}
