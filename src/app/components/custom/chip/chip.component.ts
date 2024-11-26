import { Component, input } from '@angular/core';
import { TuiChip } from '@taiga-ui/kit';

@Component({
  selector: 'ani-chip',
  standalone: true,
  imports: [TuiChip],
  templateUrl: './chip.component.html',
  styleUrl: './chip.component.scss',
})
export class ChipComponent {
  chipValue = input.required<string>();
}
