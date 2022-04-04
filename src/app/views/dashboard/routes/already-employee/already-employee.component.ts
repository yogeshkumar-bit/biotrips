import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

export interface MatData {
  data;
}

@Component({
  selector: 'app-already-employee',
  templateUrl: './already-employee.component.html',
  styleUrls: ['./already-employee.component.scss']
})
export class AlreadyEmployeeComponent implements OnInit {
  employees;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: MatData,
    private dialogRef: MatDialogRef<AlreadyEmployeeComponent>
  ) { }

  ngOnInit() {
    this.employees = this.data;
  }

}
