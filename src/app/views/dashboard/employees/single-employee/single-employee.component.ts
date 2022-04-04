import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/core/services/common/common.service';
import { MatDialog } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { EditEmployeeComponent } from '../edit-employee/edit-employee.component';
import { DeleteEmployeeComponent } from '../delete-employee/delete-employee.component';

@Component({
  selector: 'app-single-employee',
  templateUrl: './single-employee.component.html',
  styleUrls: ['./single-employee.component.scss']
})
export class SingleEmployeeComponent implements OnInit {
  employeeId;
  singleEmployee;
  constructor(
    private common: CommonService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe(res => {
      this.employeeId = res['id'];
      this.getEmployee(this.employeeId);
    })
  }

  ngOnInit() {
  }


  getEmployee(employeeId) {
    this.common.singleEmployee(employeeId).subscribe(res => {
      this.singleEmployee = res['data'];
    },
      (err) => {

      }
    )
  }



  editEmployee(data) {
    let dialogRef = this.dialog.open(EditEmployeeComponent, {
      height: '100%',
      width: '350px',
      position: {
        right: '0'
      },
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getEmployee(this.employeeId);
      }
    });
  }

  deleteEmployee(data) {
    let dialogRef = this.dialog.open(DeleteEmployeeComponent, {
      // height: '100%',
      width: '350px',
      position: {
        top: '0'
      },
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.router.navigate(['/employees']);        
      }
    });
  }

  singleCompany(comapny){
    this.router.navigate(['/comapnies',comapny._id])
  }

}
