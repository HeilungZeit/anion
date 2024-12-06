import { CommonModule } from '@angular/common';
import { Component, input, output, SimpleChanges } from '@angular/core';
import { TuiTabs } from '@taiga-ui/kit';

@Component({
  selector: 'ani-tabs',
  imports: [TuiTabs, CommonModule],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
})
export class TabsComponent {
  tabs = input.required<string[]>();
  pageId = input<number>();
  tabIndex = 0;

  onTabChange = output<number>();

  ngOnChanges(changes: SimpleChanges) {
    if (
      'pageId' in changes &&
      changes['pageId'].currentValue !== changes['pageId'].previousValue
    ) {
      this.tabIndex = 0;
    }
  }

  setTabIndex(newIndex: number) {
    this.tabIndex = newIndex;
    this.onTabChange.emit(newIndex);
  }
}
