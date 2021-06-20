import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  ValidationErrors,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

/**
 * Validates that child controls in the form group are equal.
 *
 * Note: Not specifying type of childrenEqual validator function like "childrenEqual: ValidatorFn" because
 * typescript complains:
 * Type 'AbstractControl' is missing the following properties from type 'FormGroup':
 * controls, registerControl, addControl, removeControl, and 3 more.
 */
export function childrenEqualValidator(
  formGroup: FormGroup
): ValidationErrors | null {
  const [firstControlName, ...otherControlNames] = Object.keys(
    formGroup.controls || {}
  );
  const isValid = otherControlNames.every(
    (controlName) =>
      formGroup.get(controlName)?.value ===
      formGroup?.get(firstControlName)?.value
  );
  return isValid ? null : { childrenNotEqual: true };
}

export class ConfirmValidParentMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    if (control && control.parent) {
      return control.parent.invalid && control.touched;
    }
    return false;
  }
}
