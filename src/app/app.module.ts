import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpInterceptorService } from './core/utils/httpInterceptor/http-interceptor.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './views/auth/login/login.component';
import { MaterialModule } from './core/module/material/material.module';
import { environment } from './../environments/environment';
import { ForgotPasswordComponent } from './views/auth/forgot-password/forgot-password.component';
import { ForgotPasswordModalComponent } from './views/auth/forgot-password-modal/forgot-password-modal.component';
import { reducers } from './core/store/reducers';
import { StoreModule } from '@ngrx/store';
import { DateRangePickerModule } from '@syncfusion/ej2-angular-calendars';

import {LocationStrategy,HashLocationStrategy} from '@angular/common';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

const config: SocketIoConfig = {
	url: environment.API_URL, // socket server url;
	options: {
		transports: ['polling']
	}
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ForgotPasswordComponent,
    ForgotPasswordModalComponent,
    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    AppRoutingModule,
    DateRangePickerModule,
    StoreModule.forRoot(reducers , {}),
    SocketIoModule.forRoot(config)

  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true
    },
    {provide:LocationStrategy,useClass:HashLocationStrategy}
    // { provide: LOCALE_ID, useValue: 'fr' }
  ],
  entryComponents:[ForgotPasswordModalComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
