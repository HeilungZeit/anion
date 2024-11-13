import { Component, input, OnInit } from '@angular/core';
import { TuiIcon } from '@taiga-ui/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule, NgOptimizedImage } from '@angular/common';

import { TruncatePipe } from '../../pipes/truncate.pipe';

@Component({
  selector: 'ani-tile',
  standalone: true,
  imports: [
    TuiIcon,
    NgOptimizedImage,
    TruncatePipe,
    CommonModule,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './anime-tile.component.html',
  styleUrl: './anime-tile.component.scss',
})
export class AnimeTileComponent implements OnInit {
  anime = input.required<any>();

  ngOnInit(): void {
    if (this.anime()) {
    }
  }
}
