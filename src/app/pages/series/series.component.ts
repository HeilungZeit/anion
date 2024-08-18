import { Component } from '@angular/core';
import { ContentLayout } from '../../layouts/content/content.component';

@Component({
  selector: 'app-series',
  standalone: true,
  imports: [ContentLayout],
  templateUrl: './series.component.html',
  styleUrl: './series.component.scss',
})
export class SeriesComponent {}
