import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/core/services/common/common.service';
import { MAT_DIALOG_DATA, MatDialogRef, MatPaginator } from '@angular/material';
import { SnackbarService } from 'src/app/core/utils/snackbar/snackbar.service';
import { FormGroup, FormControl } from '@angular/forms';
import {pickBy,identity} from 'lodash'
export interface MatData {
  data;
}

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  allEmployees;
  form;
  PresentPage = { page: '0', limit: 15 };
  searchData;
  selectedEmployee=[];
  constructor(
    private common:CommonService,
    @Inject(MAT_DIALOG_DATA) public data: MatData,
    private msg: SnackbarService,
    private dialogRef: MatDialogRef<AddEmployeeComponent>,
  ) { 
  }

  ngOnInit() {
    this.getEmployees({...this.PresentPage,...{company:this.data['company']['_id']}});
    this.form = new FormGroup({
      employee: new FormControl()
    })
  }

  getEmployees(params?) {
    this.common.getEmployees(pickBy(params,identity)).subscribe(res => {
      this.allEmployees = res['data'];
    },
      (err) => {

      }
    )
  }

  assignEmployee(){
    let data={
      employee:this.selectedEmployee
    }
    console.log(this.selectedEmployee);
    this.common.addEmployeeRoute(this.data['_id'],data).subscribe(
      (res) => {
        this.dialogRef.close(res['data']);
        if(res['data'].length == 0){
          this.msg.openSnackBar(res['message']);
        }
      },
      (err) => {
        console.log(err)
        this.msg.openSnackBar(err);
      }
    )
  }

  searchEmployee(event){
      this.PresentPage = {
        page: '0',
        limit: 15
      }
      this.searchData = event.target.value;
      this.paginator.pageIndex = 0;
      this.getEmployees({ ...{ search: event.target.value,company:this.data['company']['_id'] }, ...this.PresentPage });
  }

  next(pageno) {
    this.PresentPage = { page: String(pageno.pageIndex), limit: pageno.pageSize };
    this.getEmployees({ ...this.PresentPage, ...{ search: this.searchData,company:this.data['company']['_id'] } });
  }

  selectEmployee(data){
    let index = this.selectedEmployee.findIndex(element =>{
      return element == data._id;
    })
    if(index >=0){
      this.selectedEmployee.splice(index,1);
    }
    else{
      this.selectedEmployee.push(data._id);
    }
  }

  closeModal(){
    this.dialogRef.close();
  }

}
