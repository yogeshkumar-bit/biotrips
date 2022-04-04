import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export interface MatData {
  data;
}

@Component({
  selector: 'app-history-timeline',
  templateUrl: './history-timeline.component.html',
  styleUrls: ['./history-timeline.component.scss']
})
export class HistoryTimelineComponent implements OnInit {
  timeline=[];
  trip;
  constructor(
    private dialogRef: MatDialogRef<HistoryTimelineComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MatData,
  ) { 
    console.log(this.data);
    this.getTimelineData();
    this.trip = this.data;
  }
  
  getTimelineData(){
    this.timeline.push({
      name:'Trip Start',
      time:this.data['createdAt'],
      completed:'pickedup'
    });
    this.data['activities'].forEach(element => {
      if(element.status == "Completed"){
        this.timeline.push({
          name:'Trip End',
          time:element['createdAt'],
          completed:'pickedup'
        });
      }
      else{
        let index = this.data['employees'].findIndex(employee =>{
          return (element.employee && employee._id == element.employee._id)
        });
        if(index >=0){
          this.timeline.push({
            name:element.employee.name,
            address:element.employee.address.lineOne,
            time:element['createdAt'],
            completed:element.status
          });
        }
      }
    });

  }

  ngOnInit() {
  }

  close(){
    this.dialogRef.close(true);
  }

}
