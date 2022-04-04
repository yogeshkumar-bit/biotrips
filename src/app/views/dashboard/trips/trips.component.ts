import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/core/services/common/common.service';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { MatPaginator, MatDialog } from '@angular/material';
import * as moment from 'moment';
import { pickBy, identity } from 'lodash';
import { AssignCabComponent } from '../routes/assign-cab/assign-cab.component';
import { LoaderService } from 'src/app/core/utils/loader/loader.service';

@Component({
  selector: 'app-trips',
  templateUrl: './trips.component.html',
  styleUrls: ['./trips.component.scss']
})
export class TripsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  allTrips;
  todayTrips;
  singleDate = true;
  historyTrips;
  form;
  tabSelected = 0;
  dateSelected;
  loginTrips;
  logoutTrips;
  PresentPage = { page: '0', limit: 20 };
  filterDate;
  minDate = new Date();
  allVendors;
  allCompanies;
  allDrivers;
  group;
  constructor(
    private common: CommonService,
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private loader: LoaderService,
  ) { }

  ngOnInit() {
    this.group = this.common.group();
    let date = new Date();
    this.getVendors();
    this.getCompanies();
    this.getDrivers();
    this.getUpcoming({...this.PresentPage,...{date:moment.utc(date)}});
    this.form = this.fb.group({
      date: [''],
      search: [''],
      vendor:[''],
      company:[''],
      driver:[''],
      tripDate:[date?date:'']
    })
  }

  getVendors(){
    this.common.getVendors({}).subscribe(res =>{
      this.allVendors = res['data'];
    })
  }

  getDrivers(){
    this.common.getDrivers({}).subscribe(res =>{
      this.allDrivers = res['data'];
    })
  }

  getCompanies(){
    this.common.getCompanies({}).subscribe(res =>{
      this.allCompanies = res['data'];
    })
  }



  getUpcoming(params?) {
    this.common.startLoading();
    this.common.getUpcomming(pickBy(params, identity)).subscribe(res => {
      console.log(res['data'])
      this.todayTrips = res['data'];
      this.loginTrips = this.todayTrips.filter(element =>{
        return (element.pickupRoute && element.pickupRoute.pickupTime)
      }) 
      this.logoutTrips = this.todayTrips.filter(element =>{
        return (element.dropRoute && element.dropRoute.pickupTime)
      }) 
      this.common.stopLoading();
    },
      (err) => {
        this.common.stopLoading();
      }
    )
  }

  getHistory(params?) {
    this.common.startLoading();
    this.common.getHistory(pickBy(params, identity)).subscribe(res => {
      this.historyTrips = res['data'];
      this.historyTrips.forEach(element => {
        element.tripFor = 'history';
      });
      this.common.stopLoading();
    },
      (err) => {
        this.common.stopLoading();
      }
    )
  }

  changeTab(event) {
    this.paginator.pageIndex = 0;
    this.PresentPage = { page: '0', limit: 20 };
    if (event.index == 0) {
      this.getUpcoming({ ...this.PresentPage,...{date:this.form.value.tripDate?moment.utc(this.form.value.tripDate):null} });
      this.tabSelected = 0;
    }
    else if((event.index == 1)){
      this.tabSelected = 1;
      this.getUpcoming({ ...this.PresentPage,...{date:this.form.value.tripDate?moment.utc(this.form.value.tripDate):null} });
    }
    else {
      this.getHistory({ ...this.PresentPage,...this.filterDate });
      this.tabSelected = 2;
    }
  }

  dateFilter(event) {
    this.paginator.pageIndex = 0;
    this.PresentPage = {
      page: '0',
      limit: 20
    }
    this.dateSelected = true;
    if (event.value) {
      this.filterDate = {
        fromDate: moment.utc(event.startDate),
        toDate: moment.utc(event.endDate),
      }
    }
    else {
      this.filterDate = {}
    }
    this.getData({ ...this.filterDate, ...this.PresentPage, ...{ search: this.form.value.search,vendor: this.form.value.vendor,company: this.form.value.company,driver: this.form.value.driver } })
  }

  search(event) {
    this.paginator.pageIndex = 0;
    this.PresentPage = {
      page: '0',
      limit: 20
    }
    if (event.target.value == 0) {
      this.getData({ ...this.PresentPage, ...this.filterDate });
    }
    else {
      this.getData({ ...{ search: event.target.value,vendor: this.form.value.vendor,company: this.form.value.company,driver: this.form.value.driver }, ...this.PresentPage, ...this.filterDate })
    }
  }

  clearSelection() {
    this.dateSelected = false;
    this.PresentPage = {
      page: '0',
      limit: 20
    }
    this.paginator.pageIndex = 0;
    this.form.controls.date.setValue('');
    this.form.controls.vendor.setValue('');
    this.form.controls.company.setValue('');
    this.form.controls.driver.setValue('');
    this.filterDate = {};
    this.getData({ ...this.PresentPage, ...{ search: this.form.value.search } });
    setTimeout(() => {
      this.dateSelected = false;
    }, 1000)
  }

  getData(data) {
    console.log(data);
    if ((this.tabSelected == 0 ||this.tabSelected == 1)) {
      this.getUpcoming(data);
    }
    else {
      this.getHistory(data);
    }
  }

  next(pageno) {
    this.PresentPage = { page: String(pageno.pageIndex), limit: pageno.pageSize }
    // this.getRoutes({ ...this.PresentPage, ...{ status: this.selectedStatus } });
    this.getData({ ...this.PresentPage, ...this.filterDate, ...{ search: this.form.value.search,vendor: this.form.value.vendor,company: this.form.value.company,driver: this.form.value.driver } })
  }


  assignCab(data) {
    if(this.tabSelected == 0){
      data.cabFor = 'pickup';
    }
    else{
      data.cabFor = 'drop';
    }
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
        this.getData({ ...this.PresentPage, ...this.filterDate, ...{ search: this.form.value.search,vendor: this.form.value.vendor,company:this.form.value.company,driver: this.form.value.driver } })
      }
    });
  }

  onDateChange(event){
    this.singleDate = true;
    this.getUpcoming({...{date:moment.utc(event.value)},...this.PresentPage});
  }

  vendorFilter(event){
    this.dateSelected = true;
    this.getHistory({...{vendor:event.value},...this.PresentPage,...this.filterDate,...{ search: this.form.value.search,company:this.form.value.company,driver: this.form.value.driver }});
  }

  companyFilter(event){
    this.dateSelected = true;
    this.getHistory({...{company:event.value},...this.PresentPage,...this.filterDate,...{ search: this.form.value.search,vendor: this.form.value.vendor,driver: this.form.value.driver }});
  }

  driverFilter(event){
    this.dateSelected = true;
    this.getHistory({...{driver:event.value},...this.PresentPage,...this.filterDate,...{ search: this.form.value.search,vendor: this.form.value.vendor,company: this.form.value.company }});
  }

  clear(){
    this.singleDate = false;
    this.form.controls.tripDate.setValue(null);
    this.getUpcoming({...this.PresentPage});
  }

  export() {
    if(this.tabSelected == 2){
      this.common.exportTrip({...{ exports:true,search: this.form.value.search,vendor: this.form.value.vendor,company: this.form.value.company,driver: this.form.value.driver},...this.filterDate});
    }
    else if(this.tabSelected == 0){
      console.log(this.loginTrips);
      this.common.exportlogin('pickup',this.form.value.tripDate);
    }
    else{
      this.common.exportlogin('drop',this.form.value.tripDate);
    }
  }




}
