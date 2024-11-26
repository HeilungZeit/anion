import { CommonModule } from '@angular/common';
import { Component, computed, input, signal } from '@angular/core';
import { TuiButton } from '@taiga-ui/core';
import { TuiCarousel } from '@taiga-ui/kit';
import { ImageSet } from 'node-shikimori';

@Component({
  selector: 'ani-image-slider',
  standalone: true,
  imports: [TuiCarousel, CommonModule, TuiButton],
  templateUrl: './image-slider.component.html',
  styleUrl: './image-slider.component.scss',
})
export class ImageSliderComponent {
  images = input<ImageSet[]>();
  readonly defaultCount = signal<number>(2);
  readonly itemsCount = computed<number>(
    () => Math.round((this.images()?.length ?? 0) / 3) ?? this.defaultCount()
  );

  protected index = 0;
}
