import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResponseService {

  extractData(res: Response) {
    return res['data'];
  }

  public handleError(error: HttpErrorResponse) {
    console.log(error)
    let errMsg = error.error
      ? error.error['message']
      : error.status
        ? `${error.status} - ${error.statusText}`
        : 'Server error';
    return throwError(errMsg);
  }
}
