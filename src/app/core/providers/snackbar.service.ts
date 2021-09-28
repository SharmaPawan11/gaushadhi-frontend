import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(private _snackBar: MatSnackBar) {}

  openSnackBar(
    message: string,
    durationInSeconds: number = 2,
    action: string = 'Close',
  ) {
    this._snackBar.open(message, action, {
      duration: durationInSeconds * 1000,
    });
  }
}
