import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'startTime'
})
export class StartTimePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if(value){
      if(args == 'history'){
        return value
      }
      else{
       let sorted =  value.sort(function(x, y) {
          let xpickup = x.pickupRoute.pickupTime.split(':');
          let ypickup = y.pickupRoute.pickupTime.split(':');
          if(Number(xpickup[0]) != Number(ypickup[0])){
            if(Number(xpickup[0]) > Number(ypickup[0])){
              return 1
            }
            else{
              return -1;
            }
          }
          else{
            if(Number(xpickup[1]) > Number(ypickup[1])){
              return 1
            }
            else{
              return -1;
            }
          }
      });

      return sorted;
      }
    }
  }

}
