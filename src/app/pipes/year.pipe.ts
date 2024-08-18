import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getYear',
  standalone: true,
})
export class YearPipe implements PipeTransform {
  transform(value: Date | string | null): string {
    if (value) {
      if (typeof value === 'string') {
        value = new Date(value);
      }

      return value.getFullYear().toString();
    }

    return '';
  }
}
