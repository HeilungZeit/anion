import { Component } from '@angular/core';
import { TuiElasticContainerModule } from '@taiga-ui/kit';
import { TuiButtonModule, TuiSvgModule } from '@taiga-ui/core';
import {} from '@taiga-ui/icons';

@Component({
  selector: 'ani-descr',
  standalone: true,
  imports: [TuiElasticContainerModule, TuiButtonModule, TuiSvgModule],
  templateUrl: './descr.component.html',
  styleUrl: './descr.component.scss',
})
export class DescrComponent {}
