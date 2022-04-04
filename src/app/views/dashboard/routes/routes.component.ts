import { Component, OnInit, ViewChild } from "@angular/core";
import { CommonService } from "src/app/core/services/common/common.service";
import { MatDialog, MatPaginator } from "@angular/material";
import { Router } from "@angular/router";
import { CreateRouteComponent } from "./create-route/create-route.component";
import { EditRouteComponent } from "./edit-route/edit-route.component";
import { DeleteRouteComponent } from "./delete-route/delete-route.component";
import { FormBuilder } from '@angular/forms';
import { pickBy, identity } from 'lodash';
import { RemoveEmployeeComponent } from './remove-employee/remove-employee.component';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { AlreadyEmployeeComponent } from './already-employee/already-employee.component';
import { LoaderService } from 'src/app/core/utils/loader/loader.service';
import { AssignVendorRouteComponent } from './assign-vendor-route/assign-vendor-route.component';
import { NotPublishedComponent } from './not-published/not-published.component';
import { AssignCabComponent } from './assign-cab/assign-cab.component';
import { SnackbarService } from 'src/app/core/utils/snackbar/snackbar.service';

@Component({
  selector: "app-routes",
  templateUrl: "./routes.component.html",
  styleUrls: ["./routes.component.scss"]
})
export class RoutesComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public viewTable: boolean = true;
  allRoutes;
  allCompanies;
  vendor;
  allVendors;
  vendorSelected;
  PresentPage = { page: '0', limit: 20 };
  selectedStatus = 'draft';
  form;
  group;
  constructor(
    private common: CommonService,
    private dialog: MatDialog,
    private router: Router,
    private fb: FormBuilder,
    private loader: LoaderService,
    private msg:SnackbarService
  ) {
    this.group = this.common.group();
    if (this.group == 3) {
      this.selectedStatus = 'published';
    }
  }

  ngOnInit() {
    this.getVendors();
    this.getCompanies();
    this.getRoutes({ ...{ status: this.selectedStatus }, ...this.PresentPage });

    this.form = this.fb.group({
      vendor: [''],
      search: [''],
      company:[''],
      cabAssigned:[''],
    })
  }

  getRoutes(params?) {
    this.common.startLoading();
    this.common.getRoutes(pickBy(params, identity)).subscribe(
      res => {
        this.allRoutes = res["data"];
        console.log(this.allRoutes);
        this.common.stopLoading();

      },
      err => {
        this.common.stopLoading();

      }
    );
  }

  getVendors(params?) {
    this.common.getVendors(params).subscribe(res => {
      this.allVendors = res['data'];
    },
      (err) => {

      }
    )
  }

  getCompanies(params?) {
    this.common.getCompanies(params).subscribe(res => {
      this.allCompanies = res['data'];
    },
      (err) => {

      }
    )
  }

  addRoute() {
    let dialogRef = this.dialog.open(CreateRouteComponent, {
      height: "100%",
      width: "350px",
      position: {
        right: "0"
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getRoutes({ ...this.PresentPage, ...{ status: this.selectedStatus } });
      }
    });
  }

  editRoute(data) {
    let dialogRef = this.dialog.open(EditRouteComponent, {
      height: "100%",
      width: "350px",
      position: {
        right: "0"
      },
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getRoutes({ ...this.PresentPage, ...{ status: this.selectedStatus } });
      }
    });
  }

  deleteRoute(data) {
    let dialogRef = this.dialog.open(DeleteRouteComponent, {
      // height: '100%',
      width: "350px",
      position: {
        top: "0"
      },
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getRoutes({ ...this.PresentPage, ...{ status: this.selectedStatus } });
      }
    });
  }

  singleRoute(route) {
    this.router.navigate(["/routes", route._id]);
  }

  search(event) {
    this.PresentPage = { page: '0', limit: 20 };
    this.paginator.pageIndex = 0;
    this.getRoutes({ ...{ search: event.target.value, vendor: this.form.value.vendor,company: this.form.value.company, status: this.selectedStatus }, ...this.PresentPage });
  }
  card() {
    this.viewTable = false;
  }
  table() {
    this.viewTable = true;
  }
  next(pageno) {
    this.PresentPage = { page: String(pageno.pageIndex), limit: pageno.pageSize }
    this.getRoutes({ ...this.PresentPage, ...{ status: this.selectedStatus }, ...this.form.value });
  }

  changeTab(event) {
    if (event.index == 0) {
      this.selectedStatus = 'draft';
      this.PresentPage = { page: '0', limit: 20 };
      this.getRoutes({ ...{ page: '0', limit: 20, status: 'draft' }, ...this.form.value });
      this.paginator.pageIndex = 0;
    }
    else if (event.index == 1) {
      this.selectedStatus = 'published';
      this.PresentPage = { page: '0', limit: 20 };
      this.getRoutes({ ...{ page: '0', limit: 20, status: 'published' }, ...this.form.value });
      this.paginator.pageIndex = 0;
    }
    else {
      this.selectedStatus = 'live';
      this.PresentPage = { page: '0', limit: 20 };
      this.getRoutes({ ...{ page: '0', limit: 20, status: 'live' }, ...this.form.value });
      this.paginator.pageIndex = 0;
    }
  }

  export() {
    this.common.exportRoute({...{ status: this.selectedStatus,exports:true},...this.form.value});
  }

  clearSelection() {
    this.form.controls.vendor.setValue('');
    this.form.controls.cabAssigned.setValue('');
    this.form.controls.company.setValue('');
    this.vendorSelected = false;
    this.getRoutes({ page: '0', limit: 20, status: this.selectedStatus,search: this.form.value.search });
  }

  vendorFilter(event) {
    this.PresentPage = { page: '0', limit: 20 };
    this.paginator.pageIndex = 0;
    this.vendorSelected = true;
    this.getRoutes({ ...{ status: this.selectedStatus, vendor: event.value, search: this.form.value.search,company: this.form.value.company,cabAssigned: this.form.value.cabAssigned }, ...this.PresentPage });
  }

  companyFilter(event) {
    this.PresentPage = { page: '0', limit: 20 };
    this.paginator.pageIndex = 0;
    this.vendorSelected = true;
    this.getRoutes({ ...{ status: this.selectedStatus, company: event.value, search: this.form.value.search,vendor: this.form.value.vendor,cabAssigned: this.form.value.cabAssigned }, ...this.PresentPage });
  }

  cabFilter(event) {
    this.PresentPage = { page: '0', limit: 20 };
    this.paginator.pageIndex = 0;
    this.vendorSelected = true;
    this.getRoutes({ ...{ status: this.selectedStatus, cabAssigned: event.value, search: this.form.value.search,vendor: this.form.value.vendor,company: this.form.value.company }, ...this.PresentPage });
  }


  //remove employee

  removeEmp(data) {
    let dialogRef = this.dialog.open(RemoveEmployeeComponent, {
      // height: '100%',
      width: '350px',
      position: {
        top: '0'
      },
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getRoutes({ ...this.PresentPage, ...this.form.value, ...{ status: this.selectedStatus } });
      }
    });
  }

  //add emp

  addEmp(data) {
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
        this.getRoutes({ ...this.PresentPage, ...this.form.value, ...{ status: this.selectedStatus } });
      }
    });
  }

  assignRouteVendor(data) {
    // let dialogRef = this.dialog.open(AssignVendorRouteComponent, {
    //   height: '100%',
    //   width: '350px',
    //   position: {
    //     right: '0'
    //   },
    //   data: data
    // });
    // dialogRef.afterClosed().subscribe(result => {

    //   if (result) {
    //     this.getRoutes({ ...this.PresentPage, ...this.form.value, ...{ status: this.selectedStatus } });
    //     console.log(result);
    //     if(result.length>0){
    //       this.showModal(result);
    //     }
    //   }
    // });
    this.common.assignVendorRoute(data['route'],{vendor:data.vendor}).subscribe(
      (res) => {
        this.getRoutes({ ...this.PresentPage, ...this.form.value, ...{ status: this.selectedStatus } });
        this.msg.openSnackBar(res['message']);
      },
      (err) => {
        console.log(err)
        this.msg.openSnackBar(err);
        this.getRoutes({ ...this.PresentPage, ...this.form.value, ...{ status: this.selectedStatus } });
      }
    )
  }

  assignVendorAll(data) {
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
        this.getRoutes({ ...this.PresentPage, ...this.form.value, ...{ status: this.selectedStatus } });
        console.log(result);
        if(result.length>0){
          this.showModal(result);
        }
      }
    });

  }

  assignRouteCab(data) {
    // let dialogRef = this.dialog.open(AssignCabComponent, {
    //   height: '100%',
    //   width: '350px',
    //   position: {
    //     right: '0'
    //   },
    //   data: data
    // });
    // dialogRef.afterClosed().subscribe(result => {

    //   if (result) {
    //     this.getRoutes({ ...this.PresentPage, ...this.form.value, ...{ status: this.selectedStatus } });
    //   }
    // });
    this.common.assignCabRoute(data['route'], {cab:data.cab}).subscribe(
      (res) => {
        this.getRoutes({ ...this.PresentPage, ...this.form.value, ...{ status: this.selectedStatus } });
        this.msg.openSnackBar(res['message']);
      },
      (err) => {
        this.msg.openSnackBar(err);
        this.getRoutes({ ...this.PresentPage, ...this.form.value, ...{ status: this.selectedStatus } });
      }
    )
  }

  showModal(data){
    let dialogRef = this.dialog.open(NotPublishedComponent, {
      // height: '100%',
      width: '400px',
      position: {
        top: '0'
      },
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getRoutes({ ...this.PresentPage, ...this.form.value, ...{ status: this.selectedStatus } });
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
        this.getRoutes({ ...this.PresentPage, ...this.form.value, ...{ status: this.selectedStatus } });
      }
    });
  }

}
