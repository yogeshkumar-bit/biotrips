import { Component, OnInit, Inject } from '@angular/core';
import { CommonService } from 'src/app/core/services/common/common.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SnackbarService } from 'src/app/core/utils/snackbar/snackbar.service';

export interface MatData {
  data;
}

@Component({
  selector: 'app-delete-vendor',
  templateUrl: './delete-vendor.component.html',
  styleUrls: ['./delete-vendor.component.scss']
})
export class DeleteVendorComponent implements OnInit {

  constructor(
    private commonService: CommonService,
    @Inject(MAT_DIALOG_DATA) public data: MatData,
    private msg:SnackbarService,
    private dialogRef: MatDialogRef<DeleteVendorComponent>,   
  ) { }

  ngOnInit() {
  }

  delete(){
    this.commonService.deleteVendor(this.data['_id']).subscribe(
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
