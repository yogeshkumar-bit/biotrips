import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/core/services/common/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AddEmployeeComponent } from '../add-employee/add-employee.component';
import { AssignCabComponent } from '../assign-cab/assign-cab.component';
import { MatDialog } from '@angular/material';
import { EditRouteComponent } from '../edit-route/edit-route.component';
import { DeleteRouteComponent } from '../delete-route/delete-route.component';
import { RemoveEmployeeComponent } from '../remove-employee/remove-employee.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AssignVendorRouteComponent } from '../assign-vendor-route/assign-vendor-route.component';
import { AlreadyEmployeeComponent } from '../already-employee/already-employee.component';
import { NotPublishedComponent } from '../not-published/not-published.component';
import { MoveEmployeeComponent } from '../move-employee/move-employee.component';

@Component({
  selector: 'app-single-route',
  templateUrl: './single-route.component.html',
  styleUrls: ['./single-route.component.scss']
})
export class SingleRouteComponent implements OnInit {
  singleRoute;
  routeId;
  group;
  constructor(
    private common: CommonService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.route.params.subscribe(res => {
      this.routeId = res['id']
      // console.log(this.routeId)
    })
    this.group = this.common.group();
  }

  ngOnInit() {
    this.getRoute();
  }


  getRoute() {
    this.common.singleRoute(this.routeId).subscribe(res => {
      // console.log(res);
      this.singleRoute = res['data'];
       // console.log(this.singleRoute);
    },
      (err => {

      }))
  }


  addEmployee(data) {
    console.log(data)
    let dialogRef = this.dialog.open(AddEmployeeComponent, {
      height: '100%',
      width: '350px',
      position: {
        right: '0'
      },
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.length > 0) {
          this.openEmployeeModel(result);
        }
        this.getRoute();
      }
    });
  }

  removeEmployee(route, employee) {
    let dialogRef = this.dialog.open(RemoveEmployeeComponent, {
      // height: '100%',
      width: '350px',
      position: {
        top: '0'
      },
      data: {
        route: route,
        employee: employee
      }
    });
    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        this.getRoute();
      }
    });
  }

  editRoute(data) {
    let dialogRef = this.dialog.open(EditRouteComponent, {
      height: '100%',
      width: '350px',
      position: {
        right: '0'
      },
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getRoute();
      }
    });
  }

  deleteRoute(data) {
    let dialogRef = this.dialog.open(DeleteRouteComponent, {
      // height: '100%',
      width: '350px',
      position: {
        top: '0'
      },
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.router.navigate(['/routes']);
      }
    });
  }

  assingCab(data) {
    let dialogRef = this.dialog.open(AssignCabComponent, {
      height: '100%',
      width: '350px',
      position: {
        right: '0'
      },
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        this.getRoute();
      }
    });
  }

  assignRouteVendor(data) {
    let dialogRef = this.dialog.open(AssignVendorRouteComponent, {
      height: '100%',
      width: '350px',
      position: {
        right: '0'
      },
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        this.getRoute();
      }
    });
  }

  openEmployeeModel(data) {
    let dialogRef = this.dialog.open(AlreadyEmployeeComponent, {
      // height: '100%',
      width: '400px',
      position: {
        top: '0'
      },
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getRoute();
      }
    });
  }

moveEmployee(singleRouteId, employeeId){
    let dialogRef = this.dialog.open(MoveEmployeeComponent,{
      height: '100%',
      width: '300px',
      position: {
        right: '0'
      },
     data: {
      singleRouteId: singleRouteId,
      employeeId: employeeId,
     }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result){
        this.getRoute();
      }
    });
  }



  singleEmployee(employee) {
    this.router.navigate(['/employees', employee._id])
  }

  singleVendor(vendor) {
    this.router.navigate(['vendors', vendor._id])
  }

  singleCompany(company) {
    this.router.navigate(['/companies', company._id])
  }

  singleShift(shift) {
    this.router.navigate(['/shifts', shift._id])
  }

  drop(event: CdkDragDrop<string[]>) {
    if (this.group != 3) {
      moveItemInArray(this.singleRoute.employees, event.previousIndex, event.currentIndex);
      this.positionEmployee(this.singleRoute.employees);
    }
  }

  positionEmployee(data) {
    let employee = data.map(element => {
      return element._id;
    })
    this.common.updateRoute(this.singleRoute._id, { employees: employee }).subscribe(res => {
      this.getRoute();
    })
  }

}
