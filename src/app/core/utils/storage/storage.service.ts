import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _token: string;
  constructor() {
  }

  get token1(): string {
    return this._token;
  }

  set token1(value: string) {
    this._token = value;
  }
}
