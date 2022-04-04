import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SnackbarService } from 'src/app/core/utils/snackbar/snackbar.service';
import { MatDialog, MatDialogRef } from '@angular/material';

export function patternValidator(regexp: RegExp): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    const value = control.value;
    if (value === '') {
      return null;
    }
    return !regexp.test(value) ? { 'patternInvalid': { regexp } } : null;
  };
}

@Component({
  selector: 'app-forgot-password-modal',
  templateUrl: './forgot-password-modal.component.html',
  styleUrls: ['./forgot-password-modal.component.scss']
})
export class ForgotPasswordModalComponent implements OnInit {
  form;
  returnUrl: string;
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router:Router,
    private msg:SnackbarService,
    private dialogRef: MatDialogRef<ForgotPasswordModalComponent>,
  ) { }

  ngOnInit() {
    this.createForm();
    // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  createForm(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, patternValidator(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
    });
  }

  forgot(data) {
    this.auth.forgotPassword(data).
      subscribe(
        (res) => {
          this.msg.openSnackBar('Please check your mail to reset password');
          this.dialogRef.close();
          // this.router.navigate(['/forgot-password'])
        },
        (err) => {
          console.log(err);
          this.msg.openSnackBar(err['errors']?err['errors']['message']:err);
        }
      );
  }
}
