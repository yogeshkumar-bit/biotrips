import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResponseService } from '../../utils/response/response.service';
import { StorageService } from '../../utils/storage/storage.service';
import { BehaviorSubject } from 'rxjs';
import { takeLast, take, map, finalize } from 'rxjs/operators';
import { LoaderService } from '../../utils/loader/loader.service';
import * as XLSX from 'xlsx';
import saveAs from 'file-saver';
import { environment } from '../../../../environments/environment';
import { Store } from '@ngrx/store';

import { pickBy, identity } from 'lodash';
import { Subject } from "rxjs";


const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
const IMAGE_EXTENSION = '.jpg';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  loadingStatus:any = new Subject();
  public sideNav = new BehaviorSubject<any>('');
  public sideNav2 = new BehaviorSubject<any>('');
  public sideNav3 = new BehaviorSubject<any>('');
  public vendorData = new BehaviorSubject<any>('');
  public companyData = new BehaviorSubject<any>('');
  public dashboardcount$ = new BehaviorSubject<any>('');
  public cabCheck = new BehaviorSubject<any>('');
  public driverCheck = new BehaviorSubject<any>('');

  public imagePreview$ = new BehaviorSubject<any>('');
  constructor(
    private http: HttpClient,
    private response: ResponseService,
    private storage: StorageService,
    private loader: LoaderService,
    private store: Store<any>
  ) { }
  startLoading() {
    this.loadingStatus.next(true)
  }

  stopLoading() {
    this.loadingStatus.next(false)
    
  }

  // Vendor

  addVendor(data) {
    this.loader.loader = true;
    return this.http.post(`${environment.API_URL}/user/vendor`, pickBy(data, identity)).pipe(
      finalize(() => this.loader.loader = false)
    );
  }



  getVendors(data) {
    // this.loader.loader = true;

    return this.http.get(`${environment.API_URL}/user/vendors`, { params: data }).pipe(
      // finalize(() => this.loader.loader = false)
    );
  }

  getVendorsAuto(data) {
    // this.loader.loader = true;
    return this.http.get(`${environment.API_URL}/user/vendors`, { params: data }).pipe(
      // finalize(() => this.loader.loader = false)
    )
      .subscribe(
        (res) => {
          console.log(res);
          this.vendorData.next(res['data']);
        }
      );
  }

  singleVendor(id) {
    this.loader.loader = true;
    return this.http.get(`${environment.API_URL}/user/vendor/${id}`).pipe(
      finalize(() => this.loader.loader = false)
    );
  }
  updateVendor(id, data) {
    this.loader.loader = true;
    return this.http.patch(`${environment.API_URL}/user/vendor/${id}`, pickBy(data, identity)).pipe(
      finalize(() => this.loader.loader = false)
    );
  }

  deleteVendor(id) {
    this.loader.loader = true;
    return this.http.delete(`${environment.API_URL}/user/${id}`).pipe(
      finalize(() => this.loader.loader = false)
    );
  }
  assignVendor(id, data) {
    this.loader.loader = true;
    return this.http.patch(`${environment.API_URL}/user/company/${id}/assign-vendor`, data).pipe(
      finalize(() => this.loader.loader = false)
    );
  }

  publishAll(data) {
    this.loader.loader = true;
    return this.http.patch(`${environment.API_URL}/route/publish/all`, data).pipe(
      finalize(() => this.loader.loader = false)
    );
  }

  


  // Company

  addCompany(data) {
    this.loader.loader = true;
    return this.http.post(`${environment.API_URL}/user/company`, pickBy(data, identity)).pipe(
      finalize(() => this.loader.loader = false)
    );
  }

  getCompanies(data?) {
    // this.loader.loader = true;
    return this.http.get(`${environment.API_URL}/user/companies`, { params: data }).pipe(
      // finalize(() => this.loader.loader = false)
    );
  }

  getCompaniesAuto(data) {
    // this.loader.loader = true;
    return this.http.get(`${environment.API_URL}/user/companies`, { params: data }).pipe(
      // finalize(() => this.loader.loader = false)
    )
      .subscribe(
        (res) => {
          this.companyData.next(res['data']);
        }
      );
  }

  singleCompany(id) {
    this.loader.loader = true;
    return this.http.get(`${environment.API_URL}/user/company/${id}`)
      .pipe(
        takeLast(1),
        finalize(() => this.loader.loader = false)
      );
  }
  updateCompany(id, data) {
    this.loader.loader = true;
    return this.http.patch(`${environment.API_URL}/user/company/${id}`, pickBy(data, identity)).pipe(
      finalize(() => this.loader.loader = false)
    );
  }

  deleteCompany(id) {
    this.loader.loader = true;
    return this.http.delete(`${environment.API_URL}/user/${id}`).pipe(
      finalize(() => this.loader.loader = false)
    );
  }

  deletePayment(id) {
    this.loader.loader = true;
    return this.http.delete(`${environment.API_URL}/payment/${id}`).pipe(
      finalize(() => this.loader.loader = false)
    );
  }

  // assignCompany(id, data) {
  //   this.loader.loader=true;
  //   return this.http.patch(`${environment.API_URL}/vendor/${id}/assign`, data).pipe(
  //     finalize(() => this.loader.loader = false)
  //   );
  // }


  // cab

  addCab(data) {
    this.loader.loader = true;
    return this.http.post(`${environment.API_URL}/cab`, data, identity).pipe(
      finalize(() => this.loader.loader = false)
    );
  }

  getCabs(params?) {
    // this.loader.loader = true;
    return this.http.get(`${environment.API_URL}/cab`, { params: pickBy(params, identity) })
      .pipe(
        take(1),
        // finalize(() => this.loader.loader = false),
        map(res => res['data'])
      );
  }

  singleCab(id) {
    this.loader.loader = true;
    return this.http.get(`${environment.API_URL}/cab/${id}`)
      .pipe(
        takeLast(1),
        finalize(() => this.loader.loader = false)
      );
  }
  updateCab(id, data) {
    this.loader.loader = true;
    return this.http.patch(`${environment.API_URL}/cab/${id}`, data, identity).pipe(
      finalize(() => this.loader.loader = false)
    );
  }

  deleteCab(id) {
    this.loader.loader = true;
    return this.http.delete(`${environment.API_URL}/cab/${id}`).pipe(
      finalize(() => this.loader.loader = false)
    );
  }

  assignCab(data, id) {
    this.loader.loader = true;
    return this.http.patch(`${environment.API_URL}/cab/${id}/assign-driver`, data).pipe(
      finalize(() => this.loader.loader = false)
    );
  }

  // driver

  addDriver(data) {
    this.loader.loader = true;
    return this.http.post(`${environment.API_URL}/user/driver`, data, identity).pipe(
      finalize(() => this.loader.loader = false)
    );
  }

  getDrivers(params?) {
    // this.loader.loader = true;
    return this.http.get(`${environment.API_URL}/user/drivers`, { params: params })

      // .pipe(
        // takeLast(1),
        // finalize(() => this.loader.loader = false)
      // );
  }

  singleDriver(id) {
    this.loader.loader = true;
    return this.http.get(`${environment.API_URL}/user/driver/${id}`).pipe(
      finalize(() => this.loader.loader = false)
    );
  }
  updateDriver(id, data) {
    this.loader.loader = true;
    return this.http.patch(`${environment.API_URL}/user/driver/${id}`, data, identity).pipe(
      finalize(() => this.loader.loader = false)
    );
  }

  deleteDriver(id) {
    this.loader.loader = true;
    return this.http.delete(`${environment.API_URL}/user/driver/${id}`).pipe(
      finalize(() => this.loader.loader = false)
    );
  }

  assignDriver(data, id) {
    this.loader.loader = true;
    return this.http.patch(`${environment.API_URL}/cab/${id}/assign-driver`, data).pipe(
      finalize(() => this.loader.loader = false)
    );
  }

  //   changeAssignDriver(data) {
  //     this.loader.loader =true;
  //     return this.http.patch(`${environment.API_URL}/driver/changeAssignCab`, data).pipe(
  //       finalize(() => this.loader.loader = false)
  //     );
  //  }
  // removeAssignDriver(data) {
  //   this.loader.loader =true;
  //   return this.http.patch(`${environment.API_URL}/driver/removeAssignCab`, data).pipe(
  //     finalize(() => this.loader.loader = false)
  //   );
  // }

  // dashboard

  dashboardCount(data?) {
    return this.http.get(`${environment.API_URL}/user/dashboard`, { params: data });
  }

  export(params?) {
    this.loader.loader = true;
    this.http.get(`${environment.API_URL}/cab/export/cab`, { responseType: 'arraybuffer', params: params }). // { responseType: 'text' }
      subscribe(
        (res) => {
          this.saveAsExcelFile(res, 'cab_document');
          this.loader.loader = false;
        },
        (err) => {
          console.log(err);
          this.loader.loader = false;
        }
      );
  }

  exportRouteDate(params){
    this.loader.loader = true;
    this.http.get(`${environment.API_URL}/route/export/date-wise`, { responseType: 'arraybuffer', params: pickBy(params,identity) }). // { responseType: 'text' }
      subscribe(
        (res) => {
          this.saveAsExcelFile(res, 'route_document');
          this.loader.loader = false;
        },
        (err) => {
          console.log(err);
          this.loader.loader = false;
        }
      );
  }

  exportRoute(params?) {
    this.loader.loader = true;
    this.http.get(`${environment.API_URL}/route`, { responseType: 'arraybuffer', params: pickBy(params,identity) }). // { responseType: 'text' }
      subscribe(
        (res) => {
          this.saveAsExcelFile(res, 'route_document');
          this.loader.loader = false;
        },
        (err) => {
          console.log(err);
          this.loader.loader = false;
        }
      );
  }

  exportTrip(params?) {
    this.loader.loader = true;
    this.http.get(`${environment.API_URL}/trip/history`, { responseType: 'arraybuffer', params: pickBy(params,identity) }). // { responseType: 'text' }
      subscribe(
        (res) => {
          this.saveAsExcelFile(res, 'trip_document');
          this.loader.loader = false;
        },
        (err) => {
          console.log(err);
          this.loader.loader = false;
        }
      );
  }

  exportPayment(params?) {
    this.loader.loader = true;
    this.http.get(`${environment.API_URL}/payment`, { responseType: 'arraybuffer', params: params }). // { responseType: 'text' }
      subscribe(
        (res) => {
          this.saveAsExcelFile(res, 'payment_document');
          this.loader.loader = false;
        },
        (err) => {
          console.log(err);
          this.loader.loader = false;
        }
      );
  }


  expiryCabs() {
    // this.loader.loader = true;
    return this.http.get(`${environment.API_URL}/cab/expiry/cab`)
      .pipe(takeLast(1),
        // finalize(() => this.loader.loader = false)
      );
  }

  previewData() {
    this.loader.loader = true;
    return this.http.get(`${environment.API_URL}/cab/getcsv`).pipe(
      finalize(() => this.loader.loader = false)
    );
  }

  // getJson(json) {
  //   const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
  //   const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
  //   const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  //   this.saveAsExcelFile(excelBuffer, 'cab_document');
  // }

  private saveImage(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer]);
    saveAs(data, fileName + new Date().getTime()+IMAGE_EXTENSION);
  }
  
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    saveAs(data, fileName + new Date().getTime() + EXCEL_EXTENSION);
  }

  // downloadFile(data) {

  //   let ws = XLSX.utils.json_to_sheet(data);
  //   let wb = XLSX.utils.book_new();
  //   let dataTo = XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  // }

  reduxData() {
    return this.store.select('appReducers')
  }

  //employee


  getEmployees(params?) {
    return this.http.get(`${environment.API_URL}/user/employees`, { params: params })
      .pipe(
        takeLast(1),
        // finalize(() => this.loader.loader = false)

      );
  }

  createEmployee(data) {
    this.loader.loader = true;
    return this.http.post(`${environment.API_URL}/user/employee`, pickBy(data, identity))
      .pipe(
        takeLast(1),
        finalize(() => this.loader.loader = false)
      );
  }

  singleEmployee(id) {
    this.loader.loader = true;
    return this.http.get(`${environment.API_URL}/user/employee/${id}`)
      .pipe(
        takeLast(1),
        finalize(() => this.loader.loader = false)
      );
  }
  updateEmployee(id, data) {
    this.loader.loader = true;
    return this.http.patch(`${environment.API_URL}/user/employee/${id}`, pickBy(data, identity)).pipe(
      finalize(() => this.loader.loader = false)
    );
  }

  deleteEmployee(id) {
    this.loader.loader = true;
    return this.http.delete(`${environment.API_URL}/user/employee/${id}`).pipe(
      finalize(() => this.loader.loader = false)
    );
  }


  //routes


  getRoutes(params?) {
    return this.http.get(`${environment.API_URL}/route`, { params: params })
      .pipe(
        takeLast(1),
        // finalize(() => this.loader.loader = false)

      );
  }

  createRoute(data) {
    this.loader.loader = true;
    return this.http.post(`${environment.API_URL}/route`, pickBy(data, identity))
      .pipe(
        takeLast(1),
        finalize(() => this.loader.loader = false)
      );
  }

  singleRoute(id) {
    this.loader.loader = true;
    return this.http.get(`${environment.API_URL}/route/${id}`)
      .pipe(
        takeLast(1),
        finalize(() => this.loader.loader = false)
      );
  }

  updateRoute(id, data) {
    this.loader.loader = true;
    return this.http.patch(`${environment.API_URL}/route/${id}`, pickBy(data, identity)).pipe(
      finalize(() => this.loader.loader = false)
    );
  }

  deleteRoute(id) {
    this.loader.loader = true;
    return this.http.delete(`${environment.API_URL}/route/${id}`).pipe(
      finalize(() => this.loader.loader = false)
    );
  }

  assignCabRoute(id, data) {
    this.loader.loader = true;
    return this.http.patch(`${environment.API_URL}/route/${id}/assign-cab`, data).pipe(
      finalize(() => this.loader.loader = false)
    );
  }

  addEmployeeRoute(id, data) {
    this.loader.loader = true;
    return this.http.patch(`${environment.API_URL}/route/${id}/employee-add`, data).pipe(
      finalize(() => this.loader.loader = false)
    );
  }

  removeEmployeeRoute(id, data) {
    this.loader.loader = true;
    return this.http.patch(`${environment.API_URL}/route/${id}/employee-remove`, data).pipe(
      finalize(() => this.loader.loader = false)
    );
  }



  //shifts


  getShifts(params?) {
    this.loader.loader = true;
    return this.http.get(`${environment.API_URL}/shift`, { params: params })
      .pipe(
        takeLast(1),
        finalize(() => this.loader.loader = false)

      );
  }

  createShift(data) {
    this.loader.loader = true;
    return this.http.post(`${environment.API_URL}/shift`, pickBy(data, identity))
      .pipe(
        takeLast(1),
        finalize(() => this.loader.loader = false)
      );
  }

  singleShift(id) {
    this.loader.loader = true;
    return this.http.get(`${environment.API_URL}/shift/${id}`)
      .pipe(
        takeLast(1),
        finalize(() => this.loader.loader = false)
      );
  }

  updateShift(id, data) {
    this.loader.loader = true;
    return this.http.patch(`${environment.API_URL}/shift/${id}`, pickBy(data, identity)).pipe(
      finalize(() => this.loader.loader = false)
    );
  }

  deleteShift(id) {
    this.loader.loader = true;
    return this.http.delete(`${environment.API_URL}/shift/${id}`).pipe(
      finalize(() => this.loader.loader = false)
    );
  }


  //trips

  getUpcomming(params?) {
    return this.http.get(`${environment.API_URL}/trip/upcoming`, { params: params })
      .pipe(
        takeLast(1),
        // finalize(() => this.loader.loader = false)

      );
  }

  getHistory(params?) {
    return this.http.get(`${environment.API_URL}/trip/history`, { params: params })
      .pipe(
        takeLast(1),
        // finalize(() => this.loader.loader = false)

      );
  }



  createTrip(id, data) {
    this.loader.loader = true;
    return this.http.post(`${environment.API_URL}/trip/${id}`, pickBy(data, identity))
      .pipe(
        takeLast(1),
        finalize(() => this.loader.loader = false)
      );
  }

  singleTrip(id) {
    this.loader.loader = true;
    return this.http.get(`${environment.API_URL}/trip/${id}`)
      .pipe(
        takeLast(1),
        finalize(() => this.loader.loader = false)
      );
  }

  assignVendorRoute(id, data) {
    this.loader.loader = true;
    return this.http.patch(`${environment.API_URL}/route/${id}/assign-vendor`, data).pipe(
      finalize(() => this.loader.loader = false)
    );
  }

  group() {
    return localStorage.getItem('group');
  }


  cabLocations(id, params?) {
    this.loader.loader = true;
    return this.http.get(`${environment.API_URL}/cab/locations/${id}`, { params: pickBy(params, identity) })
      .pipe(
        takeLast(1),
        finalize(() => this.loader.loader = false)
      );
  }

  createPayment(data) {
    this.loader.loader = true;
    return this.http.post(`${environment.API_URL}/payment`, pickBy(data, identity))
      .pipe(
        takeLast(1),
        finalize(() => this.loader.loader = false)
      );
  }
  updatePayment(id,data) {
    this.loader.loader = true;
    return this.http.patch(`${environment.API_URL}/payment/${id}`, pickBy(data, identity))
      .pipe(
        takeLast(1),
        finalize(() => this.loader.loader = false)
      );
  }

  assignCompanyToCab(data) {
    this.loader.loader = true;
    return this.http.patch(`${environment.API_URL}/cab/assign/company`, pickBy(data, identity))
      .pipe(
        takeLast(1),
        finalize(() => this.loader.loader = false)
      );
  }


  removeCompanyToCab(data) {
    this.loader.loader = true;
    return this.http.patch(`${environment.API_URL}/cab/remove/company`, pickBy(data, identity))
      .pipe(
        takeLast(1),
        finalize(() => this.loader.loader = false)
      );
  }

  removeVendorCompany(company,data) {
    this.loader.loader = true;
    return this.http.patch(`${environment.API_URL}/user/company/${company}/remove-vendor`, pickBy(data, identity))
      .pipe(
        takeLast(1),
        finalize(() => this.loader.loader = false)
      );
  }
  

  getAddress(location){
    return this.http.get(`${environment.API_URL}/cab/get/address`, {params:location});
  }

  removeDriver(){
    this.loader.loader = true;
    return this.http.patch(`${environment.API_URL}/cab/remove/driver`,'')
    .pipe(
      takeLast(1),
      finalize(() => this.loader.loader = false)
    );
  }

  getReports(params?){
    this.loader.loader = true;
    return this.http.get(`${environment.API_URL}/route/export/date-wise`, {params:params})
    .pipe(
      takeLast(1),
      finalize(() => this.loader.loader = false)
    );
  }


  saveFile(file,name){
    saveAs(file, name);
  }

  exportlogin(type,date) {
    this.loader.loader = true;
    const options:any = {params: {type:type,date:date,exports:true}, responseType: 'arraybuffer'};
    this.http.get(`${environment.API_URL}/trip/upcoming`,options). // { responseType: 'text' }
      subscribe(
        (res) => {
          console.log(res)
          this.saveAsExcelFile(res, 'trip_document');
          this.loader.loader = false;
        },
        (err) => {
          console.log(err);
          // this.saveAsExcelFile(err, 'trip_document');
          this.loader.loader = false;
        }
      );
  }


  updateLogo(data){
    this.loader.loader = true;
    return this.http.patch(`${environment.API_URL}/user/vendor/update/logo`,data)
    .pipe(
      takeLast(1),
      finalize(() => this.loader.loader = false)
    );
  }

  downloadImage(img){
    return this.http.get(`${environment.API_URL}/cab/attachment/${img}`,{responseType:'arraybuffer'}).subscribe(res =>{
      console.log(res);
      this.saveImage(res,'img');
    },(err) =>{
      console.log(err)
    })
  }
}
