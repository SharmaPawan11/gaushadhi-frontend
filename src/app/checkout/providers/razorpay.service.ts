import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RazorpayService {
  //TODO: Environment variable for razorpay key
  private _razorpayOptions = {
    key: 'rzp_test_jUxxFtyYqKiDmd',
    order_id: '',
    currency: 'INR',
    description: 'Gaushadhi',
    image: 'https://s3.amazonaws.com/rzp-mobile/images/rzp.png',
    prefill: {
      email: '',
      contact: '',
      name: '',
    },
    config: {
      display: {
        blocks: {
          card: {
            instruments: [
              {
                method: 'card',
                // issuers: ["UTIB"],
                networks: ['MasterCard', 'Visa', 'RuPay', 'Bajaj Finserv'],
              },
            ],
          },
          upi: {
            name: 'Pay using UPI',
            instruments: [
              {
                method: 'upi',
                flows: ['collect', 'intent', 'qr'],
                apps: ['google_pay', 'bhim', 'paytm', 'phonepe'],
              },
            ],
          },
          netbanking: {
            //  name for other block
            name: 'Pay using netbanking',
            instruments: [
              {
                method: 'netbanking',
              },
            ],
          },
          wallet: {
            name: 'Pay using wallets',
            instruments: [
              {
                method: 'wallet',
                wallets: ['phonepe', 'freecharge', 'airtelmoney'],
              },
            ],
          },
        },
        sequence: [
          'block.card',
          'block.upi',
          'block.netbanking',
          'block.wallet',
        ],
        preferences: {
          show_default_blocks: false,
        },
      },
    },
    handler: function (response: any) {
      console.log(response);
    },
    modal: {
      ondismiss: function () {
        if (confirm('Are you sure, you want to close the form?')) {
          console.log('Checkout form closed by the user');
        } else {
          console.log('Complete the Payment');
        }
      },
    },
  };

  get Razorpay() {
    if (!(window as any).Razorpay) {
      throw new Error(
        'Can\'t find razorpay. Make sure you have added <script src="https://checkout.razorpay.com/v1/checkout.js"></script> in your index.html file'
      );
    }
    return (window as any).Razorpay;
  }

  get razorpayOptions() {
    return this._razorpayOptions;
  }

  set razorpayOrderId(orderId: string) {
    this._razorpayOptions.order_id = orderId;
  }

  set razorpayPrefill(prefill: {
    email: string;
    contact: string;
    name: string;
  }) {
    this._razorpayOptions.prefill = prefill;
  }

  set razorpaySuccessCallback(cb: (metadata: Object) => void) {
    this._razorpayOptions.handler = cb;
  }

  constructor() {}
}