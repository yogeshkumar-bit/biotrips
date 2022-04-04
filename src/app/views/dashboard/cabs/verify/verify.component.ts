import { Component, OnInit, Inject } from '@angular/core';
import { CommonService } from 'src/app/core/services/common/common.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { SnackbarService } from 'src/app/core/utils/snackbar/snackbar.service';
import {pickBy,identity} from 'lodash';
export interface MatData {
  data;
}

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit {
  editData;
  constructor(
    private commonService: CommonService,
    @Inject(MAT_DIALOG_DATA) public data: MatData,
    private msg: SnackbarService,
    private dialogRef: MatDialogRef<VerifyComponent>,   
  ) { 
    this.editData = this.data;
    console.log(this.data)
  }

  ngOnInit() {
  }

  delete(){
    let formData =new FormData();
    console.log(this.data['key'])
    if(this.data['cab']){
      formData.append(this.data['key'],JSON.stringify({status:this.data['val']}));
    this.commonService.updateCab(this.data['cab'],formData).subscribe(
      (res) =>{
        this.dialogRef.close(true);
        this.msg.openSnackBar(res['message']);
      },
      (err) =>{
        this.msg.openSnackBar(err);
      }
    )
    }
    else{
      let driverDetails={
        [this.data['key']]:{
          status:this.data['val']
        }
      }
      // driverDetails[this.data['key']].verified = true;
      formData.append('driverDetails',JSON.stringify(pickBy(driverDetails,identity)));
      console.log(driverDetails)
      this.commonService.updateDriver(this.data['driver'],formData).subscribe(
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
}
