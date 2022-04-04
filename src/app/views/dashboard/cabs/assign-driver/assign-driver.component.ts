import { Component, OnInit, Inject } from '@angular/core';
import { CommonService } from 'src/app/core/services/common/common.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormControl } from '@angular/forms';
import { SnackbarService } from 'src/app/core/utils/snackbar/snackbar.service';


export interface MatData {
  data;
}
@Component({
  selector: 'app-assign-driver',
  templateUrl: './assign-driver.component.html',
  styleUrls: ['./assign-driver.component.scss']
})
export class AssignDriverComponent implements OnInit {
  allDrivers;
  form;
  matData;
  constructor(
    private commonService: CommonService,
    @Inject(MAT_DIALOG_DATA) public data: MatData,
    private msg: SnackbarService,
    private dialogRef: MatDialogRef<AssignDriverComponent>,
  ) { }

  ngOnInit() {
    this.getCabs();
    this.createForm();
    this.matData = this.data;
  }

  createForm() {
    this.form = new FormGroup({
      driver: new FormControl(this.data['assigned_current_driver'] ? this.data['assigned_current_driver']['_id'] : '')
    })
  }

  getCabs() {
    this.commonService.getDrivers().subscribe(
      (res) => {
        this.allDrivers = res['data'];
      },
      (err) => {
        console.log(err)
      }
    )
  }

  assignDriver(data) {
    if (this.data['for'] == 'edit') {
      data.old_driver = this.data['assigned_current_driver']['_id'];
      this.commonService.assignDriver(data,this.data['_id']).subscribe(
        (res) => {
          this.dialogRef.close(true);
          this.msg.openSnackBar(res['message']);
        },
        (err) => {
          console.log(err)
          this.msg.openSnackBar(err);
        }
      )
    }
    else {
      this.commonService.assignDriver(data,this.data['_id']).subscribe(
        (res) => {
          console.log(res);
          // this.allCabs =res['data'];
          this.dialogRef.close(true);
          this.msg.openSnackBar(res['message']);
        },
        (err) => {
          console.log(err);
          this.msg.openSnackBar(err);
        }
      )
    }
  }

  removeDriver(data) {
    data.remove = true;
    console.log(data);
    this.commonService.assignDriver(data,this.data['_id']).subscribe(
      (res) => {
        this.dialogRef.close(true);
        this.msg.openSnackBar(res['message']);
      },
      (err) => {
        this.msg.openSnackBar(err);
      }
    )
  }

  closeModal(){
    this.dialogRef.close();
  }
}
