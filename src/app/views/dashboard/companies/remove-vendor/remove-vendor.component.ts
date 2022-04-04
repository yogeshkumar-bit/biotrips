import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CommonService } from 'src/app/core/services/common/common.service';
import { SnackbarService } from 'src/app/core/utils/snackbar/snackbar.service';

export interface MatData {
  data;
}

@Component({
  selector: 'app-remove-vendor',
  templateUrl: './remove-vendor.component.html',
  styleUrls: ['./remove-vendor.component.scss']
})
export class RemoveVendorComponent implements OnInit {

  constructor(
    private commonService: CommonService,
    private msg: SnackbarService,
    @Inject(MAT_DIALOG_DATA) public data: MatData,
    private dialogRef: MatDialogRef<RemoveVendorComponent>,   
  ) { }

  ngOnInit() {
  }

  delete(){
    this.commonService.removeVendorCompany(this.data['company'],{vendor:this.data['vendor']}).subscribe(
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
