import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'ani-player-iframe',
  standalone: true,
  imports: [CommonModule],
  template: `
    <iframe
      class="player"
      frameborder="0"
      width="100%"
      height="600px"
      *ngIf="url()"
      [src]="url()"
      frameborder="0"
      allowfullscreen
    >
    </iframe>
  `,
  styles: [
    `
      .player {
        border-radius: 12px;
        overflow: hidden;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerIframeComponent {
  url = input.required<SafeResourceUrl>();
}
