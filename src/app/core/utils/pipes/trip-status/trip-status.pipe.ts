import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tripStatus'
})
export class TripStatusPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let pickedData = value.activities.filter(element =>{
      return (element.employee && (element.status== 'pickedup'));
    });
    let totalCount = value.employees.length;
    return pickedData.length + '/' + totalCount;
  }

}
