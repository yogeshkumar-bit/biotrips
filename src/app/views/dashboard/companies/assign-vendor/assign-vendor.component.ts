import { Component, OnInit, Inject } from '@angular/core';
import { CommonService } from 'src/app/core/services/common/common.service';
import { FormGroup, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { SnackbarService } from 'src/app/core/utils/snackbar/snackbar.service';

export interface MatData {
  data;
}


@Component({
  selector: 'app-assign-vendor',
  templateUrl: './assign-vendor.component.html',
  styleUrls: ['./assign-vendor.component.scss']
})
export class AssignVendorComponent implements OnInit {
  allVendors;
  form;
  constructor(
    private commonService: CommonService,
    @Inject(MAT_DIALOG_DATA) public data: MatData,
    private msg: SnackbarService,
    private dialogRef: MatDialogRef<AssignVendorComponent>,
  ) { }

  ngOnInit() {
    this.getVendors();
    this.createForm();
  }

  createForm(){
    this.form = new FormGroup({
      vendor:new FormControl('')
    })
  }

  getVendors(){
    this.commonService.getVendors('').subscribe(
      (res) =>{
        this.allVendors =res['data'];
      },
      (err) =>{
        console.log(err)
      }
    )
  }

  assignVendor(data){
    this.commonService.assignVendor(this.data['_id'],data).subscribe(
      (res) =>{
        this.msg.openSnackBar(res['message']);
        this.dialogRef.close(true);
      },
      (err) =>{
        console.log(err);
        this.msg.openSnackBar(err);
      }
    )
  }

  closeModal(){
    this.dialogRef.close();
  }

}
