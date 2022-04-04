import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  socket;
  constructor() { }


  public initSocket() {
    let url = 'https://biotrips.in';
    // let url = 'http://localhost:7000';
    this.socket = io.connect(url, {
      transports: ['polling']
    });
  }

  public socketForOne(id) {
    this.socket = io.connect('http://api.biotrips.app', {
      query: { _id: id },
      transports: ['polling']
    });
  }

  public end(){
    this.socket.emit('end', '', (err) => {
      console.log(err);
    });
  }

  

  public emitEvent(event, data: any) {
    return this.socket.emit(event, data, (err) => {
      console.log(err);
    });
  }

  public onEvent(event: any) {
    return new Observable<any>(observer => {
      this.socket.on(event, (res) => {
        observer.next(res)
      });
    });
    
  }

  public removeListner() {
    this.socket.removeAllListeners();
  }


}
