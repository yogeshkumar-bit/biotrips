import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'red'
})
export class RedPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let date = new Date();
    value = value.split(":");
    let valDate = new Date();
    valDate.setHours(value[0],value[1],0,0);
    if((valDate.getTime() - date.getTime())/(1000*60) < 0){
      return false;
    }
    else if((valDate.getTime() - date.getTime())/(1000*60) < 240){
      return true;
    }
  }

}
