import { Injectable } from '@angular/core';
import { AnimeStatus } from 'node-shikimori';

@Injectable({
  providedIn: 'root',
})
export class StatusService {
  getStatus(status: AnimeStatus): string {
    const statuses = {
      anons: 'Анонс',
      ongoing: 'Онгоинг',
      released: 'Вышло',
    };

    return statuses[status];
  }
}
