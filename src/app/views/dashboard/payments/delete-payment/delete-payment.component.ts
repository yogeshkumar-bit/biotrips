import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CommonService } from 'src/app/core/services/common/common.service';
import { SnackbarService } from 'src/app/core/utils/snackbar/snackbar.service';

export interface MatData {
  data;
}

@Component({
  selector: 'app-delete-payment',
  templateUrl: './delete-payment.component.html',
  styleUrls: ['./delete-payment.component.scss']
})
export class DeletePaymentComponent implements OnInit {

  constructor(
    private commonService: CommonService,
    private msg: SnackbarService,
    @Inject(MAT_DIALOG_DATA) public data: MatData,
    private dialogRef: MatDialogRef<DeletePaymentComponent>,   
  ) { }

  ngOnInit() {
    console.log(this.data)
  }

  delete(){
    this.commonService.deletePayment(this.data['_id']).subscribe(
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
