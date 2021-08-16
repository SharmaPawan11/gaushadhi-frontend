import { Injectable } from '@angular/core';
import {BehaviorSubject, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private orderData = new Subject();
  orderData$ = this.orderData.asObservable()

  pushNewOrderData(data: any) {
    this.orderData.next(data);
  }
  constructor() { }
}
