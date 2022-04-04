import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SnackbarService } from 'src/app/core/utils/snackbar/snackbar.service';
import { ForgotPasswordModalComponent } from '../forgot-password-modal/forgot-password-modal.component';
import { MatDialog } from '@angular/material';

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
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm;
  returnUrl: string;
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private msg:SnackbarService,
    private dialog:MatDialog
  ) {
    if(localStorage.getItem('currentUser')){
      this.router.navigate(['']);
    }
   }

  ngOnInit() {
    this.createForm();
    // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  createForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, patternValidator(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      password: ['', Validators.required],
    });
  }

  login(data) {
    this.auth.login(data).
      subscribe(
        (res) => {
          console.log(res);
          this.loginForm.reset();
          this.msg.openSnackBar(res['message'])
          this.router.navigate(['/']);
        },
        (err) => {
          console.log(err);
          this.msg.openSnackBar(err['errors']?err['errors']['message']:err);
        }
      );
  }

  forgotPassword(){
    let dialogRef = this.dialog.open(ForgotPasswordModalComponent, {
      // height: '100%',
      width: '350px',
      position: {
        top: '0'
      },
      // data: this.for
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

}
