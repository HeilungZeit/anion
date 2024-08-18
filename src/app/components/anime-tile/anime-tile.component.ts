import { Component, input, OnInit } from '@angular/core';
import { TuiSvgModule } from '@taiga-ui/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AnimeBasic } from 'node-shikimori';
import { CommonModule, NgOptimizedImage } from '@angular/common';

import { TruncatePipe } from '../../pipes/truncate.pipe';
import { StatusService } from '../../services/helpers/get-status.service';

@Component({
  selector: 'ani-tile',
  standalone: true,
  imports: [
    TuiSvgModule,
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
  anime = input.required<AnimeBasic>();
  viewStatus: string = '';
  episodesAmount: number = 0;

  constructor(private statusService: StatusService) {}

  ngOnInit(): void {
    if (this.anime()) {
      this.viewStatus = this.statusService.getStatus(this.anime().status);
      this.episodesAmount = this.anime().episodes;
    }
  }
}
