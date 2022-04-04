import { Component, OnInit, Inject } from '@angular/core';
import { CommonService } from 'src/app/core/services/common/common.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { SnackbarService } from 'src/app/core/utils/snackbar/snackbar.service';
import { FormBuilder } from '@angular/forms';

export interface MatData {
  data;
}

@Component({
  selector: 'app-assign-vendor-route',
  templateUrl: './assign-vendor-route.component.html',
  styleUrls: ['./assign-vendor-route.component.scss']
})
export class AssignVendorRouteComponent implements OnInit {
  allVendors;
  form;
  editData;
  constructor(
    private commonService:CommonService,
    @Inject(MAT_DIALOG_DATA) public data: MatData,
    private msg: SnackbarService,
    private dialogRef: MatDialogRef<AssignVendorRouteComponent>,
    private fb:FormBuilder
  ) { }

  ngOnInit() {
    
    if(this.data['company']){
      this.getVendors({company:this.data['company']['_id']});
    }
    else{
      this.getVendors();
    }
    this.editData = this.data;
    console.log(this.editData)
    this.form = this.fb.group({
      vendor:[this.data['vendor']?this.data['vendor']['_id']:'']
    })
  }

  getVendors(params?) {
    this.commonService.getVendors(params).subscribe(res => {
      this.allVendors = res['data'];
    },
      (err) => {

      }
    )
  }

  assignRoute(data){
    if(this.editData == 'all'){
      this.commonService.publishAll(data).subscribe(
        (res) => {
          if(res['data'].length == 0){
            this.msg.openSnackBar(res['message']);
          }
          this.dialogRef.close(res['data']);
        },
        (err) => {
          console.log(err)
          this.msg.openSnackBar(err);
        }
      )
    }
    else{
      this.commonService.assignVendorRoute(this.data['_id'],data).subscribe(
        (res) => {
          this.dialogRef.close([]);
          this.msg.openSnackBar(res['message']);
        },
        (err) => {
          console.log(err)
          this.msg.openSnackBar(err);
        }
      )
    }
    
  }

  closeModal(){
    this.dialogRef.close();
  }

}
