import { Injectable } from '@angular/core';
import {ScriptService} from "../../core/providers/script.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  scriptLoaded: boolean = false;

  constructor(
    private scriptService: ScriptService
  ) { }

  loadGoogleSignInScript() {
    return new Promise(async (resolve, reject) => {
      if (this.scriptLoaded) {
        resolve(true);
      } else {
        const isScriptLoaded = await this.scriptService.loadScript('googleSignIn');
        if (isScriptLoaded) {
          this.scriptLoaded = true;
          resolve(true);
        } else {
          resolve(false);
        }
      }
    });
  }

  async getSha256Hash(...variables: any) {
    let rawString = '';
    variables.forEach((variable: string | object | number) => {
      if (typeof variable === 'string') {
        rawString += variable;
      } else if (typeof variable === 'object') {
        rawString += JSON.stringify(variable);
      } else {
        rawString += variable.toString();
      }
    });
    return await this.rawStringToSha256Hash(rawString);
  }

  async rawStringToSha256Hash(rawString: string) {
    const msgBuffer = new TextEncoder().encode(rawString);

    // hash the message
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

    // convert ArrayBuffer to Array
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    // convert bytes to hex string
    return hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
  }
}
