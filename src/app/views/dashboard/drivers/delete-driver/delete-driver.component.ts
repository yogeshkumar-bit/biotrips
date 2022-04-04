import { Component, OnInit, Inject } from '@angular/core';
import { CommonService } from 'src/app/core/services/common/common.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { SnackbarService } from 'src/app/core/utils/snackbar/snackbar.service';

export interface MatData {
  data;
}

@Component({
  selector: 'app-delete-driver',
  templateUrl: './delete-driver.component.html',
  styleUrls: ['./delete-driver.component.scss']
})
export class DeleteDriverComponent implements OnInit {

  constructor(
    private commonService: CommonService,
    @Inject(MAT_DIALOG_DATA) public data: MatData,
    private msg: SnackbarService,
    private dialogRef: MatDialogRef<DeleteDriverComponent>,   
  ) { }

  ngOnInit() {
  }

  delete(){
    this.commonService.deleteDriver(this.data['_id']).subscribe(
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
