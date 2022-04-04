import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SnackbarService } from 'src/app/core/utils/snackbar/snackbar.service';



@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  loginForm;
  returnUrl: string;
  token;
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private msg:SnackbarService,
  ) { 
    this.route.queryParams.subscribe(
      (res) =>{
        this.token = res['token'];
      }
    )

    if(localStorage.getItem('token')){
      this.msg.openSnackBar('You are already logged-in');
      this.router.navigate(['']);
    }
  }

  ngOnInit() {
    this.createForm();
    // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  createForm(): void {
    this.loginForm = this.fb.group({
      password: ['', [Validators.required]],
    });
  }

  reset(data) {
    data.token = this.token;
    this.auth.resetPassword(data).
      subscribe(
        (res) => {
          console.log(res);
          this.loginForm.reset();
          this.msg.openSnackBar(res['message'])
          this.router.navigate(['/login']);
        },
        (err) => {
          console.log(err);
          this.msg.openSnackBar(err['errors']?err['errors']['message']:err);
        }
      );
  }

}
