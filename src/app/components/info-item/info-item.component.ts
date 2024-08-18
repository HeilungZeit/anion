import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { InfoItemI } from '../../pages/anime/interfaces/types';
import { TuiSvgModule } from '@taiga-ui/core';

@Component({
  selector: 'ani-info-item',
  standalone: true,
  imports: [CommonModule, TuiSvgModule],
  templateUrl: './info-item.component.html',
  styleUrl: './info-item.component.scss',
})
export class InfoItemComponent {
  item = input.required<InfoItemI>({ alias: 'item' });
}
