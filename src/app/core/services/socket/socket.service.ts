import { Injectable } from '@angular/core';
// import * as io from 'socket.io-client';
import { environment } from '../../../../environments/environment';
import { Socket } from 'ngx-socket-io';  
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  socket;
  constructor() { }


  public initSocket() {
    // let url = 'https://biotrips.in';
    let url = environment.SOCKET_URL;
    // this.socket = io.connect(url, {
    //   transports: ['polling']
    // });
    this.socket = new Socket({
      url: url, // socket server url;
      options: {
        transports: ['polling']
      }});
  }

  public socketForOne(id) {
    // this.socket = io.connect('http://api.biotrips.app', {
    //   query: { _id: id },
    //   transports: ['polling']
    // });
    this.socket = new Socket({
      url: environment.SOCKET_URL, // socket server url;
      options: {
        query: { _id: id },
        transports: ['polling']
      }});
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
