import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScriptService {

  constructor() { }

  scripts = [
    {
      name: 'razorpay',
      src: 'https://checkout.razorpay.com/v1/checkout.js'
    },
    {
      name: 'googleSignIn',
      src: 'https://accounts.google.com/gsi/client'
    }
  ]

  loadScript(name: string) {
    return new Promise((resolve, reject) => {

      const scriptObject = this.scripts.find((script) => {
        if (script.name === name) {
          return script;
        }
        return null;
      });

      if (scriptObject) {
        let script = document.createElement('script');
        script.src = scriptObject.src;
        script.onload = () => {
          resolve(true);
        };
        script.onerror = (error: any) => resolve(false);
        document.getElementsByTagName('head')[0].appendChild(script);
      } else {
        resolve(false);
      }
    });
  }
}
