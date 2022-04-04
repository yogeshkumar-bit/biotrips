import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, concatMap, retry, tap, map, shareReplay, finalize } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { environment } from './../../../../environments/environment';
import { ResponseService } from '../../utils/response/response.service';
import { StorageService } from '../../utils/storage/storage.service';
import { LoaderService } from '../../utils/loader/loader.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient,
     private response: ResponseService,
     private loader:LoaderService,
      private storage: StorageService) { }

  public login(data): Observable<boolean> {
    return this.http.post(`${environment.API_URL}/user/login`, data)
      .pipe(
        shareReplay(),
        concatMap(duration =>
          this.makeRequest(duration).pipe(
            tap((res) => {
              // set storage here
              window.localStorage.setItem('currentUser', JSON.stringify(res['data']['token']));
              window.localStorage.setItem('group', JSON.stringify(res['data']['group']));
              // window.localStorage.setItem('name', JSON.stringify(res['data']['name']));
              // window.localStorage.setItem('id', JSON.stringify(res['data']['id']));
              window.localStorage.setItem('userData', JSON.stringify(res['data']));
            })
          )
        ),
        retry(3),
        catchError(e => this.response.handleError(e))
      );
  }

  public signup(data): Observable<boolean> {
    return this.http.post(`${environment.API_URL}/user/signup`, data)
      .pipe(
        shareReplay(),
        concatMap(duration =>
          this.makeRequest(duration).pipe(
            map(res => res),
            tap((res) => {
              // console.log('response in tap' + JSON.stringify(res));
              // set storage here
            })
          )
        ),
        retry(3),
        catchError(e => this.response.handleError(e))
      );
  }

  forgotPassword(data) {
    this.loader.loader = true;
    return this.http.patch(`${environment.API_URL}/user/forgot-password-mail`, data).pipe(
      finalize(() => this.loader.loader = false)
    );
  }
  resetPassword(data) {
    this.loader.loader = true;
    return this.http.patch(`${environment.API_URL}/user/forgot-password`, data).pipe(
      finalize(() => this.loader.loader = false)
    );
  }

  makeRequest(timeToDelay): Observable<boolean> {
    return of(timeToDelay);
  }

}
