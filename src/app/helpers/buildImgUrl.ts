import { Anime, AnimeBasic, ImageSet } from 'node-shikimori';
import { BASE_SHIKIMORI_URL } from '../constants';

type ContentT = { [key: string]: string };

export const buildImgUrl = (animes: AnimeBasic[]) =>
  animes.map((anime) => {
    const updatedImages: Record<string, string> = {};
    for (const key in anime.image) {
      if (anime.image.hasOwnProperty(key) && anime.image[key]) {
        updatedImages[key] = BASE_SHIKIMORI_URL + anime.image[key];
      }
    }
    anime.image = updatedImages;
    return anime;
  });

export const addBaseUrlToAnimeData = (
  animeData: Anime
): {
  image: ContentT;
  screenshots: ImageSet[];
} => {
  const image: ContentT = {};
  const screenshots: ImageSet[] = [];
  if (animeData.image) {
    for (const key in animeData.image) {
      if (animeData.image.hasOwnProperty(key)) {
        image[key] = `${BASE_SHIKIMORI_URL}${animeData.image[key]}`;
      }
    }
  }

  if (animeData.screenshots) {
    animeData.screenshots.forEach((screenshot) => {
      const updatedScreenshot: ImageSet = {};
      for (const key in screenshot) {
        if (screenshot.hasOwnProperty(key)) {
          updatedScreenshot[key] = `${BASE_SHIKIMORI_URL}${screenshot[key]}`;
        }
      }
      screenshots.push(updatedScreenshot);
    });
  }

  return {
    image,
    screenshots,
  };
};
