import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _currentUserId: string = '';
  private _isAuthenticated: boolean = false;

  set currentUserId(userId: string) {
    if (userId) {
      this._currentUserId = userId;
      this._isAuthenticated = true;
      localStorage.setItem('userId', this._currentUserId);
    }
  }

  get currentUserId(): string {
    return this._currentUserId;
  }

  constructor() {}
}
