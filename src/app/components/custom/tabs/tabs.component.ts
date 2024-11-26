import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { TuiTabs } from '@taiga-ui/kit';

@Component({
  selector: 'ani-tabs',
  standalone: true,
  imports: [TuiTabs, CommonModule],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
})
export class TabsComponent {
  protected tabIndex = 0;

  tabs = input.required<string[]>();
  onTabChange = output<number>();

  setTabIndex(newIndex: number) {
    this.onTabChange.emit(newIndex);
  }
}
