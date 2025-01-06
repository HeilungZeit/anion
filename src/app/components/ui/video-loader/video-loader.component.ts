import { Component } from '@angular/core';

@Component({
  selector: 'ani-video-loader',
  imports: [],
  template: `
    <video autoplay loop muted class="loader">
      <source src="loader.mp4" type="video/mp4" />
    </video>
  `,
  styleUrl: './video-loader.component.scss',
})
export class VideoLoaderComponent {}
