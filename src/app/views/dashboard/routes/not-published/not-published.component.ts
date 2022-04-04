import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export interface MatData {
  data;
}

@Component({
  selector: 'app-not-published',
  templateUrl: './not-published.component.html',
  styleUrls: ['./not-published.component.scss']
})
export class NotPublishedComponent implements OnInit {
  editData;
  constructor(
    private dialogRef: MatDialogRef<NotPublishedComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MatData,
  ) { 
    console.log(this.data);
    this.editData = this.data;
  }

  ngOnInit() {
  }

  close(){
    this.dialogRef.close(true);
  }

}
