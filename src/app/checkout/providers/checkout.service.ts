import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  nextButtonStatus = new Subject<'disabled' | 'enabled'>();
  nextButtonStatus$ = this.nextButtonStatus.asObservable();
  onNext = new Subject<null>();
  onNext$ = this.onNext.asObservable();

  disableNextButton() {
    this.nextButtonStatus.next('disabled');
  }

  enableNextButton() {
    this.nextButtonStatus.next('enabled');
  }

  proceedToNextStep() {
    this.onNext.next(null);
  }

  constructor() {}
}
