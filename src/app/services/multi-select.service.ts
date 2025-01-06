import { signal, computed } from '@angular/core';
import { TuiContext } from '@taiga-ui/cdk';

interface SelectableItem {
  value: number | string;
  title: string;
}

export class MultiSelectService<T extends SelectableItem> {
  protected searchItems = signal<T[]>([]);
  protected searchText = signal<string | null>(null);

  constructor(private items: () => T[]) {}

  itemsToShow = computed(() => {
    if (this.searchText() && !this.searchItems().length) {
      return [];
    }

    if (this.searchText() && this.searchItems().length) {
      return this.searchItems();
    }

    return this.items();
  });

  stringifyItems = (id: TuiContext<T>): string | undefined => {
    const itemsMap = new Map(
      this.items().map<[T['value'], string]>(({ value, title }) => [
        value,
        title,
      ])
    );

    return itemsMap.get(id.$implicit.value);
  };

  stringify(item: T): string {
    return item.title;
  }

  onSearch(text: string | null): void {
    this.searchText.set(text);

    const filteredItems = this.items().filter(({ title }) =>
      title.toLowerCase().includes(text?.toLowerCase() || '')
    );

    this.searchItems.set(filteredItems);
  }
}
