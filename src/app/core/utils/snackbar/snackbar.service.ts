import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(
    private snackBar: MatSnackBar
  ) { }

  openSnackBar(message) {
    let msg = message['error']?message['error']['message']:message
    return this.snackBar.open(msg, 'close', {
      duration: 3000,
      // verticalPosition: 'top',
      verticalPosition: 'top',
      horizontalPosition:'right'
    });
  }
}
