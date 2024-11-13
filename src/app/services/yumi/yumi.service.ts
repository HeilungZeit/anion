import { inject, Injectable } from '@angular/core';
import { AxiosService } from '../axios/axios.service';

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
}
