import { Component, OnInit, Inject } from '@angular/core';
import { CommonService } from 'src/app/core/services/common/common.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { SnackbarService } from 'src/app/core/utils/snackbar/snackbar.service';
import { FormGroup, FormControl } from '@angular/forms';

export interface MatData {
  data;
}

@Component({
  selector: 'app-remove-employee',
  templateUrl: './remove-employee.component.html',
  styleUrls: ['./remove-employee.component.scss']
})
export class RemoveEmployeeComponent implements OnInit {
  constructor(
    private commonService: CommonService,
    private msg: SnackbarService,
    private dialogRef: MatDialogRef<RemoveEmployeeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MatData,
  ) {
    console.log(this.data)
   }

  ngOnInit() {
  }

  delete(){
    this.commonService.removeEmployeeRoute(this.data['route']['_id'],{employee:this.data['employee']['_id']}).subscribe(
      (res) =>{
        this.dialogRef.close(true);
        this.msg.openSnackBar(res['message']);        
      },
      (err) =>{
        this.msg.openSnackBar(err);
      }
    )
  }
}
