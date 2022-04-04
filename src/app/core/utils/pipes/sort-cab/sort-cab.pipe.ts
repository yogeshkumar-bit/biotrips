import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortCab'
})
export class SortCabPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    console.log(value)
    value.sort((a,b) => b.isOnline - a.isOnline)
    return value;
  }

}
