import {Component, forwardRef, Input, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
  Validators
} from "@angular/forms";
import {childrenEqualValidator, ConfirmValidParentMatcher} from "../../../common/validators/childrenEqual.validator";
import {ErrorStateMatcher} from "@angular/material/core";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";

@Component({
  selector: 'gaushadhi-confirm-password',
  templateUrl: './confirm-password.component.html',
  styleUrls: ['./confirm-password.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ConfirmPasswordComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ConfirmPasswordComponent),
      multi: true
    }
  ]
})
export class ConfirmPasswordComponent implements OnInit, ControlValueAccessor, Validator, OnDestroy {
  @Input() confirmPasswordTemplate!: TemplateRef<any>;
  destroy$: Subject<boolean> = new Subject<boolean>();
  onTouched: () => void = () => {};
  onChange: (val: string) => void = () => {};
  passwordEqualityMatcher: ErrorStateMatcher = new ConfirmValidParentMatcher();
  hidePassword: boolean = true;
  hideConfirmPassword: boolean = true;
  confirmPasswordGroup: FormGroup = this.fb.group({
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    },
    { validators: childrenEqualValidator }
  )

  get password() {
    return this.confirmPasswordGroup.get('password');
  }

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn
    this.confirmPasswordGroup.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(value => {
      this.onChange(value)
    })
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.confirmPasswordGroup.disable() : this.confirmPasswordGroup.enable()
  }

  writeValue(obj: any): void {

  }

  validate(control: AbstractControl): ValidationErrors | null {
    return this.confirmPasswordGroup.valid ? null : {
      invalidForm: {
        valid: false,
        message: "Passwords didn't match"
      }
    }
  }

}
