import { Component, OnInit, Inject } from '@angular/core';
import { CommonService } from 'src/app/core/services/common/common.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SnackbarService } from 'src/app/core/utils/snackbar/snackbar.service';

export interface MatData {
  data;
}

@Component({
  selector: 'app-delete-employee',
  templateUrl: './delete-employee.component.html',
  styleUrls: ['./delete-employee.component.scss']
})
export class DeleteEmployeeComponent implements OnInit {

  constructor(
    private commonService: CommonService,
    private msg: SnackbarService,
    private dialogRef: MatDialogRef<DeleteEmployeeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MatData,
  ) { }

  ngOnInit() {
  }

  delete(){
    this.commonService.deleteEmployee(this.data['_id']).subscribe(
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
