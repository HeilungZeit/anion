import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

export function yearRangeValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const fromYear = group.get('yearFrom')?.value;
    const toYear = group.get('yearTo')?.value;

    if (fromYear && toYear && fromYear > toYear) {
      return { yearRange: true };
    }

    return null;
  };
}
