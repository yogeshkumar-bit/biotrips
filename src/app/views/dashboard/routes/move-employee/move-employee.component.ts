import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CommonService } from 'src/app/core/services/common/common.service';
import { SnackbarService } from 'src/app/core/utils/snackbar/snackbar.service';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { htmlAstToRender3Ast } from '@angular/compiler/src/render3/r3_template_transform';

export interface MatData {
  data;
}

@Component({
  selector: 'app-move-employee',
  templateUrl: './move-employee.component.html',
  styleUrls: ['./move-employee.component.scss']
})
export class MoveEmployeeComponent implements OnInit {
  form: FormGroup;
  getData;
  employeeCompanyId;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: MatData,
    private dialogRef: MatDialogRef<MoveEmployeeComponent>,
    private common: CommonService,
    private msg: SnackbarService,
    private fb: FormBuilder,

  ) { }

  ngOnInit() {
    // console.log(this.data);
    this.common.getRoutes().subscribe(res => {
      this.getData = res['data']; 
      // console.log(this.getData);
    });

    this.form = this.fb.group({
      routeId: [''],
    });

    this.employeeCompanyId = this.data['employeeId']['employeeDetails'].company;
    // console.log(this.employeeCompanyId);
  }

selectedRoute() {
    const formdata = this.form.getRawValue();
    this.common.removeEmployeeRoute(this.data['singleRouteId']['_id'], { employee: this.data['employeeId']['_id'] }).subscribe(
      (res) => {
        this.addEmployee(formdata);
      },
      (err) => {
        this.msg.openSnackBar(err);
      }
    );
  }

  addEmployee(formdata) {
    this.common.addEmployeeRoute(formdata.routeId, { employee: [this.data['employeeId']['_id']] }).subscribe(
      (res) => {
        // console.log(res);
        this.dialogRef.close(res['data']);
        this.msg.openSnackBar(res['message']);
      },
      (err) => {
        // console.log(err);
        this.msg.openSnackBar(err);
      }
    );
  }
}
