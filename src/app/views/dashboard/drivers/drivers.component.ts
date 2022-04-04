import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/core/services/common/common.service';
import { MatDialog, MatPaginator } from '@angular/material';
import { CreateDriverComponent } from './create-driver/create-driver.component';
import { EditDriverComponent } from './edit-driver/edit-driver.component';
import { DeleteDriverComponent } from './delete-driver/delete-driver.component';
import { Router } from '@angular/router';
import { pickBy, identity } from 'lodash';
import { LoaderService } from 'src/app/core/utils/loader/loader.service';
import { SnackbarService } from 'src/app/core/utils/snackbar/snackbar.service';

@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.component.html',
  styleUrls: ['./drivers.component.scss']
})
export class DriversComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = [
    "name",
    "email",
    "phone",
    "vendor",
    "cab",
    "action"
  ];
  loader;
  PresentPage = { page: '0', limit: 20 };
  searchData;
  public viewTable: boolean = true;
  allDrivers;
  allVendors;
  allCabs=[{name:''}];
  vendor;
  pageno: any;
  group;
  constructor(
    private common: CommonService,
    private dialog: MatDialog,
    private router: Router,
    private msg:SnackbarService
  ) { 
    this.group = this.common.group();
  }

  ngOnInit() {
    this.getDrivers(this.PresentPage);
    this.getVendors();
    // this.getCabs();
  
  }


  getDrivers(params?) {
    this.common.startLoading();
    this.common.getDrivers(pickBy(params, identity)).subscribe(res => {
      this.allDrivers = res['data'];
      this.common.stopLoading();

    },
      (err) => {
        this.common.stopLoading();
      }
    )
  }


  getVendors(params?) {
    this.common.getVendors('').subscribe(res => {
      this.allVendors = res['data'];

    },
      (err) => {
      }
    )
  }
  getCabs(params) {
    this.allCabs=[{name:''}]
    this.loader =true;
    this.common.getCabs(params).subscribe(res => {
      this.allCabs = res;
      if (this.allCabs.length == 0) {
        this.allCabs = [{ name: 'There is no cabs' }];
      }
    this.loader =false;
    },
      (err) => {
    this.loader =false;
      }
    )
  }

  addDriver() {
    let dialogRef = this.dialog.open(CreateDriverComponent, {
      height: '100%',
      width: '350px',
      position: {
        right: '0'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getDrivers({ ...this.PresentPage, ...{ search: this.searchData,vendor:this.vendor } });
      }
    });
  }

  editDriver(data) {
    let dialogRef = this.dialog.open(EditDriverComponent, {
      height: '100%',
      width: '350px',
      position: {
        right: '0'
      },
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getDrivers({ ...this.PresentPage, ...{ search: this.searchData,vendor:this.vendor } });
      }
    });
  }

  deleteDriver(data) {
    let dialogRef = this.dialog.open(DeleteDriverComponent, {
      // height: '100%',
      width: '350px',
      position: {
        top: '0'
      },
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getDrivers({ ...this.PresentPage, ...{ search: this.searchData,vendor:this.vendor } });
      }
    });
  }

  singleDriver(driver) {
    this.router.navigate(['/drivers', driver._id])
  }

  search(event) {
    this.searchData = event.target.value;
    if (event.target.value.length > 2) {
      this.PresentPage = {
        page: '0',
        limit: 20
      }
      this.paginator.pageIndex = 0;
      this.getDrivers({ ...{ search: event.target.value ,vendor:this.vendor}, ...this.PresentPage });
    }
    else if (event.target.value.length == 0) {
      this.getDrivers(this.PresentPage);
    }
  }

  card() {
    this.viewTable = false;
  }
  table() {
    this.viewTable = true;
  }
  next(pageno) {
    this.PresentPage = { page: String(pageno.pageIndex), limit: pageno.pageSize }
    this.getDrivers({ ...this.PresentPage, ...{ search: this.searchData,vendor:this.vendor } });


  }

  vendorFilter(event){
    this.getDrivers({ ...this.PresentPage, ...{ search: this.searchData,vendor:event.value } });
  }

  clearSelection(){
    this.vendor=null;
    this.getDrivers({ ...this.PresentPage, ...{ search: this.searchData } });
  }

  assignCab(event,data){
    let formData ={
      driver:data._id
    }
    this.common.assignDriver(formData,event.value).subscribe(
      (res) => {
                this.getDrivers({ ...this.PresentPage, ...{ search: this.searchData,vendor:this.vendor } });        
        this.msg.openSnackBar(res['message']);
      },
      (err) => {
        this.msg.openSnackBar(err);
                this.getDrivers({ ...this.PresentPage, ...{ search: this.searchData,vendor:this.vendor } });        
      }
    )
  }
}
