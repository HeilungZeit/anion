import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toFixedValue',
  standalone: true,
})
export class ToFixedValuePipe implements PipeTransform {
  transform(
    value: number | string,
    digitsAfterDot: number = 1
  ): number | string {
    if (!value) {
      return value;
    }

    return Number(value).toFixed(digitsAfterDot);
  }
}
