import { Component } from '@angular/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'ani-tiles-skeleton',
  imports: [NgxSkeletonLoaderModule],
  templateUrl: './tiles-skeleton.component.html',
  styleUrl: './tiles-skeleton.component.scss',
})
export class TilesSkeletonComponent {}
