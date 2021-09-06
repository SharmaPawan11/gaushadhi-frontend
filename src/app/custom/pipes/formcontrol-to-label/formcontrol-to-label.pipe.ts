import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formcontrolToLabel',
})
export class FormcontrolToLabelPipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): unknown {
    let resultString = '';
    let lastUpperCaseIndex = 0;
    resultString = value[lastUpperCaseIndex].toUpperCase();
    let i;
    for (i = 0; i < value.length; i++) {
      if (value[i] === value[i].toUpperCase()) {
        resultString += value.substring(lastUpperCaseIndex + 1, i);
        resultString += ' ';
        resultString += value[i].toUpperCase();
        lastUpperCaseIndex = i;
      }
    }
    resultString += value.substring(lastUpperCaseIndex + 1, i);
    return resultString;
  }
}
