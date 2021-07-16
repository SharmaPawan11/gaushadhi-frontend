import {
  Component,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  Self,
  TemplateRef,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  NgControl,
  ValidationErrors,
  Validator,
  Validators,
} from '@angular/forms';
import {
  childrenEqualValidator,
  ConfirmValidParentMatcher,
} from '../../../common/validators/childrenEqual.validator';
import { ErrorStateMatcher } from '@angular/material/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormcontrolToLabelPipe } from '../../pipes/formcontrol-to-label.pipe';

@Component({
  selector: 'gaushadhi-confirm-input',
  templateUrl: './confirm-input.component.html',
  styleUrls: ['./confirm-input.component.scss'],
  providers: [FormcontrolToLabelPipe],
})
export class ConfirmInputComponent
  implements OnInit, ControlValueAccessor, OnDestroy
{
  @Input() customConfirmPasswordTemplate!: TemplateRef<any>;
  @Input() formCtrlName!: string;
  firstControlName!: string;
  secondControlName!: string;

  destroy$: Subject<boolean> = new Subject<boolean>();

  onTouched: () => void = () => {};
  onChange: (val: string) => void = () => {};

  hideInput: boolean = false;
  hideConfirmInput: boolean = false;
  inputType: string = 'text';

  formInitialized = false;
  confirmPasswordGroup!: FormGroup;
  inputEqualityMatcher: ErrorStateMatcher = new ConfirmValidParentMatcher();
  errorMessageMap = new Map();

  constructor(
    @Self() public controlDir: NgControl,
    private fb: FormBuilder,
    private formControlToLabelPipe: FormcontrolToLabelPipe
  ) {
    controlDir.valueAccessor = this;
  }

  ngOnInit(): void {
    // TODO: Make 'required' and 'invalid' bold. Currently applying <b> on it doesn't work.
    this.errorMessageMap.set('required', (formControlName: string) => {
      return `${this.formControlToLabelPipe.transform(
        formControlName
      )} is required`;
    });
    this.errorMessageMap.set('email', (formControlName: string) => {
      return `${this.formControlToLabelPipe.transform(
        formControlName
      )} is invalid`;
    });
    this.errorMessageMap.set('pattern', (formControlName: string) => {
      return `Invalid ${this.formControlToLabelPipe.transform(
        formControlName
      )}`;
    });

    // Get access to underlying form control
    const underlyingControl = this.controlDir.control;

    // using underlying form control's name as formControlName for first input
    // and "confirmFormControlName" as second formControlName
    this.firstControlName = this.controlDir.name as string;
    if (!this.firstControlName) {
      if (!this.formCtrlName) {
        console.error(
          'Must wrap isolated formControl inside formGroup or provide formControlName via Input property'
        );
        this.firstControlName = 'unrecognisedFormControl' as string;
      }
      this.firstControlName = this.formCtrlName;
    }
    this.secondControlName =
      'confirm' +
      this.firstControlName.slice(0, 1).toUpperCase() +
      this.firstControlName.slice(1);

    // Getting applied validators on underlying formControl so that we can apply
    // on formControls in this component
    let appliedValidators = underlyingControl?.validator;
    if (!appliedValidators) {
      appliedValidators = Validators.required;
    }

    // Initializing form with underlying formControl's validators and name.
    this.confirmPasswordGroup = this.fb.group(
      {
        [this.firstControlName]: ['', [appliedValidators]],
        [this.secondControlName]: ['', [appliedValidators]],
      },
      { validators: childrenEqualValidator }
    );

    if (this.firstControlName.toUpperCase().indexOf('PASSWORD') !== -1) {
      this.inputType = 'password';
      this.hideInput = true;
      this.hideConfirmInput = true;
    }
    this.formInitialized = true;

    /**
     * Whenever formGroup's value in this component changes, we check if
     this form is valid. Only if this form is valid i.e. -
        1. Underlying control's validation are true on each input.
        2. Both the inputs in this form match
     Then we set the value of this component to first control's value so
     that underlying formControl's validation also turns valid.

     IMPORTANT: Set the value only if this ENTIRE form is valid because
     there is an equality check on individual form controls. Setting the value
     without checking if form is valid will result in this component being valid
     without the individual formControls' values matching.
     */

    this.confirmPasswordGroup.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (this.confirmPasswordGroup.valid) {
          this.onChange(value[this.firstControlName]);
        } else {
          this.onChange('');
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  getErrors(formControlName: string) {
    let formControl;
    if (!(formControl = this.confirmPasswordGroup.get(formControlName))) {
      return [];
    }

    const { errors } = formControl;
    if (!errors) {
      return [];
    }
    return Object.keys(errors).map((key) => {
      return this.errorMessageMap.has(key)
        ? this.errorMessageMap.get(key)(formControlName)
        : <string>errors[key] || key;
    });
  }

  writeValue(obj: any): void {
    console.log(obj);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled
      ? this.confirmPasswordGroup.disable()
      : this.confirmPasswordGroup.enable();
  }

  // validate(control: AbstractControl): ValidationErrors | null {
  //   return this.confirmPasswordGroup.valid
  //     ? null
  //     : {
  //         invalidForm: {
  //           valid: false,
  //           message: "Passwords didn't match",
  //         },
  //       };
  // }
}
