import { Component, input, signal } from '@angular/core';
import { TuiElasticContainer } from '@taiga-ui/kit';
import { TuiButton } from '@taiga-ui/core';
import { TruncatePipe } from '../../../../pipes/truncate.pipe';

@Component({
  selector: 'ani-descr',
  imports: [TuiElasticContainer, TuiButton, TruncatePipe],
  templateUrl: './descr.component.html',
  styleUrl: './descr.component.scss',
})
export class DescrComponent {
  description = input<string>('');

  isExpanded = signal(false);

  cutDescription() {
    if (this.description()?.length && (this.description()?.length || 0) > 400) {
      return this.description()?.slice(0, 400) + '...';
    }
    return this.description;
  }

  toggelExpand() {
    this.isExpanded.update((prev) => !prev);
  }
}
