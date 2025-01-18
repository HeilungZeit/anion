import { Directive, ElementRef, input } from '@angular/core';
import { LAST_ITEM_TOKEN } from '../tokens/last-item.token';

@Directive({
  selector: '[lastItem]',
  providers: [
    {
      provide: LAST_ITEM_TOKEN,
      useExisting: ElementRef,
    },
  ],
  standalone: true,
})
export class LastItemDirective {
  lastItem = input<boolean>();
}
