import { Component } from '@angular/core';
import { TuiElasticContainer } from '@taiga-ui/kit';
import { TuiButton } from '@taiga-ui/core';
import {} from '@taiga-ui/icons';

@Component({
  selector: 'ani-descr',
  standalone: true,
  imports: [TuiElasticContainer, TuiButton],
  templateUrl: './descr.component.html',
  styleUrl: './descr.component.scss',
})
export class DescrComponent {}
