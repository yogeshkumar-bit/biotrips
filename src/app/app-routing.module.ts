import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/guard/authguard/auth.gaurd';
import { LoginComponent } from './views/auth/login/login.component';
import { ForgotPasswordComponent } from './views/auth/forgot-password/forgot-password.component';



const routes: Routes = [
  {
    path: '',
    loadChildren: './views/dashboard/dashboard.module#DashboardModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  },
  { path: '**', redirectTo: '' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
