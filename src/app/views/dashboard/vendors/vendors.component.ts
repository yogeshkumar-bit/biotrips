import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/core/services/common/common.service';
import { MatDialog, MatPaginator } from '@angular/material';
import { CreateVendorComponent } from './create-vendor/create-vendor.component';
import { EditVendorComponent } from './edit-vendor/edit-vendor.component';
import { DeleteVendorComponent } from './delete-vendor/delete-vendor.component';
import { Router } from '@angular/router';
import { pickBy, identity } from 'lodash';
import { LoaderService } from 'src/app/core/utils/loader/loader.service';
import { RemoveVendorComponent } from '../companies/remove-vendor/remove-vendor.component';



@Component({
  selector: 'app-vendors',
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.scss']
})
export class VendorsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = [
    "name",
    "email",
    "phone",
    "owner",
    "action"
  ];
  public viewTable: boolean = true;
  allVendors;
  PresentPage = { page: '0', limit: 20 };
  searchData;
  user;
  constructor(
    private common: CommonService,
    private dialog: MatDialog,
    private router: Router,
    private loader: LoaderService,
  ) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('userData'));
    console.log(this.user)
    this.getVendors(this.PresentPage);
  }


  getVendors(params?) {
    this.common.startLoading();
    this.common.getVendors(pickBy(params, identity)).subscribe(res => {
      this.allVendors = res['data'];
      this.common.stopLoading();
    },
      (err) => {
        this.common.stopLoading();

      }
    )
  }

  addVendor() {
    let dialogRef = this.dialog.open(CreateVendorComponent, {
      height: '100%',
      width: '350px',
      position: {
        right: '0'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getVendors({ ...this.PresentPage, ...{ search: this.searchData } });
      }
    });
  }

  editVendor(data) {
    let dialogRef = this.dialog.open(EditVendorComponent, {
      height: '100%',
      width: '350px',
      position: {
        right: '0'
      },
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getVendors({ ...this.PresentPage, ...{ search: this.searchData } });
      }
    });
  }

  deleteVendor(data) {
    let dialogRef = this.dialog.open(DeleteVendorComponent, {
      // height: '100%',
      width: '350px',
      position: {
        top: '0'
      },
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getVendors({ ...this.PresentPage, ...{ search: this.searchData } });
      }
    });
  }

  singleVendor(vendor) {
    this.router.navigate(['/vendors', vendor._id])
  }

  search(event) {
    this.searchData = event.target.value;

    if (event.target.value.length > 2) {
      this.PresentPage = {
        page: '0',
        limit: 20
      }
      this.paginator.pageIndex = 0;
      this.getVendors({ ...{ search: event.target.value }, ...this.PresentPage });
    }
    else if (event.target.value.length == 0) {
      this.getVendors(this.PresentPage);

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
    this.getVendors({ ...this.PresentPage, ...{ search: this.searchData } });


  }

  removeVendor(data){
    let dialogRef = this.dialog.open(RemoveVendorComponent, {
      // height: '100%',
      width: '350px',
      position: {
        top: '0'
      },
      data:{
        vendor:data._id,
        company:this.user._id
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.getVendors();
      }     
    });
  }

}
