import { Component, OnInit, ViewChild } from '@angular/core';
import { CreateCabComponent } from './create-cab/create-cab.component';
import { MatDialog, MatPaginator } from '@angular/material';
import { CommonService } from 'src/app/core/services/common/common.service';
import { EditVendorComponent } from '../vendors/edit-vendor/edit-vendor.component';
import { DeleteCabComponent } from './delete-cab/delete-cab.component';
import { EditCabComponent } from './edit-cab/edit-cab.component';
import { Router } from '@angular/router';
import { AssignDriverComponent } from './assign-driver/assign-driver.component';
import { ExportPreviewComponent } from './export-preview/export-preview.component';
import { pickBy, identity } from 'lodash';
import { LoaderService } from 'src/app/core/utils/loader/loader.service';
import { AssignCompanyComponent } from './assign-company/assign-company.component';
import { BlockedCabModalComponent } from './blocked-cab-modal/blocked-cab-modal.component';

@Component({
  selector: 'app-cabs',
  templateUrl: './cabs.component.html',
  styleUrls: ['./cabs.component.scss']
})
export class CabsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  list = [];
  isAllSelected;
  displayedColumns: string[] = [
    "checkbox",
    "name",
    "number",
    "model",
    "vendor",
    "driver",
    "action"
  ];
  searchData;
  public viewTable: boolean = true;
  allCabs;
  allCompanies;
  allVendors;
  company;
  vendor;
  group = JSON.parse(localStorage.getItem('group'));
  PresentPage = { page: '0', limit: 20 };

  constructor(
    private common: CommonService,
    private dialog: MatDialog,
    private router: Router,
    private loader: LoaderService,
  ) { }

  ngOnInit() {
    this.getCabs(this.PresentPage);
    this.getVendors();
    this.getCompanies();
  }


  getCabs(params?) {
    this.common.startLoading();
    this.common.getCabs(pickBy(params, identity)).subscribe(res => {
      this.allCabs = res;
      this.list=[];
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

  getCompanies(params?) {
    this.common.getCompanies('').subscribe(res => {
      this.allCompanies = res['data'];
    },
      (err) => {
      }
    )
  }

  addCab() {
    let dialogRef = this.dialog.open(CreateCabComponent, {
      height: '100%',
      width: '350px',
      position: {
        right: '0'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getCabs({ ...{ search: this.searchData,vendor:this.vendor,assignedTo:this.company }, ...this.PresentPage });
      }
    });
  }

  editCab(data) {
    let dialogRef = this.dialog.open(EditCabComponent, {
      height: '100%',
      width: '350px',
      position: {
        right: '0'
      },
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        this.getCabs({ ...{ search: this.searchData,vendor:this.vendor,assignedTo:this.company }, ...this.PresentPage });
      }
    });
  }

  deleteCab(data) {
    let dialogRef = this.dialog.open(DeleteCabComponent, {
      // height: '100%',
      width: '350px',
      position: {
        top: '0'
      },
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getCabs({ ...{ search: this.searchData,vendor:this.vendor,assignedTo:this.company }, ...this.PresentPage });
      }
    });
  }

  singleCab(cab) {
    this.router.navigate(['/cabs', cab._id])
  }

  assignDriver(data, val) {
    data.for = val;
    let dialogRef = this.dialog.open(AssignDriverComponent, {
      height: '100%',
      width: '350px',
      position: {
        right: '0'
      },
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getCabs({ ...{ search: this.searchData,vendor:this.vendor,assignedTo:this.company }, ...this.PresentPage });
      }
    });
  }

  exportPreview() {
    let dialogRef = this.dialog.open(ExportPreviewComponent, {
      height: '100%',
      minHeight: '600px',
      minWidth: '800px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }

  search(event) {
    if (event.target.value.length > 2) {
      this.PresentPage = {
        page: '0',
        limit: 20
      }
      this.paginator.pageIndex = 0;
      this.searchData = event.target.value;
      this.getCabs({ ...{ search: event.target.value,vendor:this.vendor,assignedTo:this.company }, ...this.PresentPage });
    }
    else if (event.target.value.length == 0) {
      this.getCabs({...this.PresentPage,...{vendor:this.vendor,assignedTo:this.company}});

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
    this.getCabs({ ...this.PresentPage, ...{ search: this.searchData,vendor:this.vendor,assignedTo:this.company } });
  }

  showPath(cab) {
    console.log(cab)
    this.router.navigate([`/trips/cab/${cab._id}/path`, 'notrip'])
  }

  singleSelect(event, lead, i ) {
    console.log(lead)
    lead.show = !lead.show;
    if (lead.show) {
      this.list.push(lead)
    }
    else {
      let index = this.list.findIndex(x => x._id === lead._id)
      this.list.splice(index, 1);
      this.isAllSelected = false;
    }

  }


  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(event, lead) {
    this.isAllSelected = true;
    this.list = [];
    if (event.checked) {
      lead.forEach(element => {
        element.show = true;
        this.list.push(element);
      });


    }
    else {
      lead.forEach(element => {
        element.show = false;
      });
      this.list = [];


    }
  }

  unCheck(data, i) {
    // console.log(this.allSimpleLeads,this.allSimpleLeads[i])
    this.allCabs[i].show = !this.allCabs[i].show;
    if (this.allCabs[i].show) {
      this.list.push(data)
    }
    else {
      // console.log('splice',i,this.list)
      let index = this.list.findIndex(x => x._id === data._id)
      this.list.splice(index, 1);
    }

    // console.log(this.list)

  }

  assingCompany(){
    if(this.list.length >0){
      let dialogRef = this.dialog.open(AssignCompanyComponent, {
        height: '100%',
        width: '350px',
        position: {
          right: '0'
        },
        data: this.list
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result && result.length>0) {
          this.list = [];
          this.isAllSelected = false;
          this.getCabs({ ...{ search: this.searchData ,vendor:this.vendor,assignedTo:this.company}, ...this.PresentPage });
          this.openModal(result);
        }
      });
    }
  }

  vendorFilter(event){
    this.getCabs({ ...this.PresentPage, ...{ search: this.searchData,vendor:event.value,assignedTo:this.company } });
  }

  companyFilter(event){
    this.getCabs({ ...this.PresentPage, ...{ search: this.searchData,assignedTo:event.value,vendor:this.vendor} });
  }

  clearSelection(){
    this.vendor=null;
    this.company=null;
    this.getCabs({ ...this.PresentPage, ...{ search: this.searchData } });
  }

  openModal(data){
    let dialogRef = this.dialog.open(BlockedCabModalComponent, {
      // height: '100%',
      width: '450px',
      position: {
        top: '0'
      },
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        
      }
    });
  }

  export() {
    this.common.exportPayment({ exports:true });
  }

}
