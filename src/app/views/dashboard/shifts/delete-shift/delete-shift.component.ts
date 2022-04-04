import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common/common.service';
import { SnackbarService } from 'src/app/core/utils/snackbar/snackbar.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export interface MatData {
  data;
}

@Component({
  selector: 'app-delete-shift',
  templateUrl: './delete-shift.component.html',
  styleUrls: ['./delete-shift.component.scss']
})
export class DeleteShiftComponent implements OnInit {

  constructor(
    private commonService: CommonService,
    private msg: SnackbarService,
    private dialogRef: MatDialogRef<DeleteShiftComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MatData,
  ) { }

  ngOnInit() {
  }

  delete(){
    this.commonService.deleteShift(this.data['_id']).subscribe(
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
