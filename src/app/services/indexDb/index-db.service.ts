import { Injectable } from '@angular/core';

export interface WatchedEpisode {
  id: string; // Составной ключ: animeId_episode_dubber_player
  animeId: number; // ID аниме
  episode: number; // Номер серии
  dubber: string; // Даббер
  player: string; // Плеер
  timestamp: number; // Время просмотра
}

@Injectable({
  providedIn: 'root',
})
export class IndexDbService {
  private dbName = 'animeDB';
  private dbVersion = 1;
  private db: IDBDatabase | null = null;

  constructor() {
    this.initDB();
  }

  private initDB(): void {
    const request = indexedDB.open(this.dbName, this.dbVersion);

    request.onerror = (event) => {
      console.error('Ошибка открытия БД:', event);
    };

    request.onsuccess = (event) => {
      this.db = (event.target as IDBOpenDBRequest).result;
      console.log('БД успешно открыта');
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Создаем хранилище для просмотренных серий
      if (!db.objectStoreNames.contains('watchedEpisodes')) {
        const watchedStore = db.createObjectStore('watchedEpisodes', {
          keyPath: 'id',
        });
        watchedStore.createIndex('animeId', 'animeId');
        watchedStore.createIndex('dubber', 'dubber');
        watchedStore.createIndex('player', 'player');
      }
    };
  }

  checkDbInit(): boolean {
    return !!this.db;
  }

  // Отметить серию как просмотренную
  async markEpisodeAsWatched(
    animeId: number,
    episode: number,
    dubber: string,
    player: string
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject('БД не инициализирована');
        return;
      }

      const id = `${animeId}_${episode}_${dubber}_${player}`;
      const transaction = this.db.transaction(['watchedEpisodes'], 'readwrite');
      const store = transaction.objectStore('watchedEpisodes');

      // Сначала проверяем существование записи
      const getRequest = store.get(id);

      getRequest.onsuccess = () => {
        // Если запись уже существует, просто обновляем timestamp
        const watchedEpisode: WatchedEpisode = getRequest.result;

        if (!watchedEpisode) {
          const newWatchedEpisode: WatchedEpisode = {
            id,
            animeId,
            episode,
            dubber,
            player,
            timestamp: new Date().getTime(),
          };

          const putRequest = store.put(newWatchedEpisode);
          putRequest.onsuccess = () => resolve();
          putRequest.onerror = () =>
            reject('Ошибка при сохранении просмотренной серии');
        }
      };

      getRequest.onerror = () =>
        reject('Ошибка при проверке существования записи');
    });
  }

  // Получить все просмотренные серии для конкретного аниме
  async getWatchedEpisodes(
    animeId: number,
    dubber?: string,
    player?: string
  ): Promise<WatchedEpisode[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject('БД не инициализирована');
        return;
      }

      const transaction = this.db.transaction(['watchedEpisodes'], 'readonly');
      const store = transaction.objectStore('watchedEpisodes');
      const request = store.getAll();

      request.onsuccess = () => {
        let results = request.result.filter(
          (episode) => episode.animeId === animeId
        );

        if (dubber) {
          results = results.filter((episode) => episode.dubber === dubber);
        }

        if (player) {
          results = results.filter((episode) => episode.player === player);
        }

        resolve(results.sort((a, b) => a.episode - b.episode));
      };
      request.onerror = () => reject('Ошибка получения просмотренных серий');
    });
  }

  // Проверить, просмотрена ли конкретная серия
  async isEpisodeWatched(
    animeId: number,
    episode: number,
    dubber: string,
    player: string
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject('БД не инициализирована');
        return;
      }

      const id = `${animeId}_${episode}_${dubber}_${player}`;
      const transaction = this.db.transaction(['watchedEpisodes'], 'readonly');
      const store = transaction.objectStore('watchedEpisodes');
      const request = store.get(id);
      request.onsuccess = () => resolve(!!request.result);
      request.onerror = () => reject('Ошибка проверки просмотренной серии');
    });
  }

  // Удалить отметку о просмотре серии
  async removeWatchedEpisode(
    animeId: number,
    episode: number,
    dubber: string,
    player: string
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject('БД не инициализирована');
        return;
      }

      const id = `${animeId}_${episode}_${dubber}_${player}`;
      const transaction = this.db.transaction(['watchedEpisodes'], 'readwrite');
      const store = transaction.objectStore('watchedEpisodes');
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject('Ошибка удаления отметки о просмотре');
    });
  }

  // Очистить историю просмотренных серий для конкретного аниме
  async clearWatchedEpisodes(animeId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject('БД не инициализирована');
        return;
      }

      const transaction = this.db.transaction(['watchedEpisodes'], 'readwrite');
      const store = transaction.objectStore('watchedEpisodes');
      const request = store.getAll();

      request.onsuccess = () => {
        const episodes = request.result.filter(
          (episode) => episode.animeId === animeId
        );

        const deletePromises = episodes.map(
          (episode) =>
            new Promise<void>((resolveDelete, rejectDelete) => {
              const deleteRequest = store.delete(episode.id);
              deleteRequest.onsuccess = () => resolveDelete();
              deleteRequest.onerror = () => rejectDelete();
            })
        );

        Promise.all(deletePromises)
          .then(() => resolve())
          .catch(() => reject('Ошибка очистки просмотренных серий'));
      };

      request.onerror = () => reject('Ошибка получения просмотренных серий');
    });
  }
}
