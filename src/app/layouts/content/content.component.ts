import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ani-content',
  imports: [],
  templateUrl: './content.component.html',
  styleUrl: './content.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentLayout {}
