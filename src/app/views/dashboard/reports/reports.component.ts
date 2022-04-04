import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/core/services/common/common.service';
import { FormBuilder } from '@angular/forms';
import * as moment from 'moment';
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  displayedColumns: string[] = [];
  form;
  reportData;
  filterDate;
  initialDate;
  constructor(
    private common: CommonService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      date: ['']
    });

    let date = new Date();
    let firstDate = new Date(date.getFullYear(),date.getMonth(),1);
    console.log(date,firstDate)
    this.filterDate={from:moment.utc(firstDate),to:moment.utc(date)}
    this.initialDate={from:moment.utc(firstDate),to:moment.utc(date)}
    this.getReports(this.filterDate);
  }

  getReports(params) {
    this.common.getReports(params).subscribe(
      (res) => {
        this.displayedColumns =[];
        this.reportData = res;
        this.reportData.forEach(element => {
          for(let key of Object.keys(element)){
            // if(key != 'name' && key != 'slab' && key != 'slabAmount'){
            //   element.days =[];
            // element.days.push({date:key,in:element[key]})
            // }
            let index  = this.displayedColumns.indexOf(key);
            if(index <0){
            this.displayedColumns.push(key);
            }
          }
        });
        console.log(this.displayedColumns)
      },
      (err) => {

      }
    )
  }

  dateFilter(event) {
    this.filterDate = {
      from: moment.utc(event.startDate),
      to: moment.utc(event.endDate),
    }
    this.getReports(this.filterDate);
  }

  clearSelection(){
    this.form.reset();
    this.getReports(this.initialDate);
  }

  export(){
    this.common.exportRouteDate({...this.filterDate,...{exports:true}});
  }

}
