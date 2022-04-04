import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { CommonService } from 'src/app/core/services/common/common.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SocketService } from 'src/app/core/services/socket/socket.service';
import { Store } from '@ngrx/store';
import { CAB_ID, IS_ALL, ALL_CAB, EMPTY_DATA } from 'src/app/core/store/actions/appActions';
import { SelectCabComponent } from '../select-cab/select-cab.component';
import { MatDialog } from '@angular/material';
import * as moment from 'moment';
import { LoaderService } from 'src/app/core/utils/loader/loader.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  organizationModule = localStorage.getItem('organization-modules');
  mobileQuery: MediaQueryList;
  sidebarHide = true;
  allCabs = [];
  mapFor;
  selectedIndex;
  searchData;
  selectedCab = 'all';
  radio=0;
  isAll;
  private _mobileQueryListener: () => void;
  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private common: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private socket: SocketService,
    private store: Store<any>,
    private dialog: MatDialog,
    private loader: LoaderService,
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.socket.initSocket();
  }

  ngOnInit() {
    // this.common.reduxData().subscribe(res =>{
    //   console.log(res)
    //   if(res['selectedIndex'] == 'no'){
    //     this.selectedIndex = -1;
    //   }
    //   else{
    //    this.selectedIndex = this.selectedIndex;
    //   }
    // })
    console.log('xyz')
    this.getCabs();
    setInterval(() => {
      // if (this.allCabs.length > 0) {
      //   this.allCabs.forEach((element, index) => {
      //     let date = new Date();
      //     if (element.address && element.address.location) {
      //       this.checkUpdate(this.allCabs[index], element.location, date);
      //     }
      //   });
      // }

      this.getCabList();
    }, 20000)
  }

  getCabList(param?){
    this.common.getCabs(param).subscribe(res => {
      if (this.allCabs.length > 0) {
        this.allCabs.forEach((element, index) => {
          let date = new Date();
          if (element.address && element.address.location) {
            this.checkUpdate(this.allCabs[index], element.location, date);
          }
        });
      }
    },
      (err) => {
      }
    )
  }


  getCabs(param?) {
    this.common.startLoading();
    this.common.getCabs(param).subscribe(res => {
      this.allCabs = res;
      this.allCabs = this.allCabs.sort((a, b) => b.isOnline - a.isOnline);
      // console.log(this.allCabs)
      this.initialColorSetup(this.allCabs);
      this.updateColorSetup();
      if (this.allCabs.length > 0) {
        this.singleCab(this.allCabs[0], 0)
      }
      this.common.stopLoading();
    },
      (err) => {
        this.common.stopLoading();
      }
    )
  }
  

  singleCab(cab, i) {
    // console.log(cab);
    this.mapFor = 'single';
    this.router.navigate(['/track']);
    this.selectedIndex = i;
    this.store.dispatch({
      type: CAB_ID,
      payload: cab
    });
  }

  initialColorSetup(cabs) {
    cabs.forEach((element, index) => {
      if (element.assigned_current_driver) {
        if (element.assigned_current_driver.address && element.assigned_current_driver.address.location && element.assigned_current_driver.address.location) {
          let date = new Date();
          this.checkUpdate(cabs[index], element.assigned_current_driver.address.location, date);
        }
        else {
          element.isOnline = false;
        }
      }
      else {
        element.isOnline = false;
      }
    });
  }

  updateColorSetup() {
    this.socket.onEvent('allLocation').subscribe(res => {
      if (res) {
        this.allCabs.forEach((element, index) => {
          if (element.assigned_current_driver && element.assigned_current_driver._id == res._id) {
            element.location = res;
            let date = new Date();
            this.checkUpdate(this.allCabs[index], res, date);
            // this.allCabUpdate();
            // console.log('if',element);
          }
          else {
            // console.log('else',element);
            let date = new Date();
            if (element.location) {
              this.checkUpdate(this.allCabs[index], element.location, date);
            }
            // this.allCabUpdate();
          }
          // console.log(element)
        });
      }
    })
  }

  allCabUpdate() {
    let cabData = this.allCabs.slice();
    this.store.dispatch({
      type: ALL_CAB,
      payload: cabData
    });
  }

  showAllCabs() {
    // this.store.dispatch({
    //   type: EMPTY_DATA,
    //   payload: {
    //     cab: '',
    //     allCabData: [],
    //     isAll: true,
    //     isSelected: false,
    //     selectedCab: [],
    //   }
    // });
    this.store.dispatch({
      type: EMPTY_DATA,
      payload: {
        cab: '',
        isAll:true,
        allCabData: [],
        isSelected: false,
        selectedCab: [],
      }
    });
    this.selectedIndex = -1;
    this.mapFor = 'all';
    this.router.navigate(['/track/all']);
  }

  selectedCabs() {
    let dialogRef = this.dialog.open(SelectCabComponent, {
      height: '100%',
      width: '350px',
      position: {
        right: '0'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.mapFor = 'selected';
        this.selectedIndex = -1;
        this.store.dispatch({
          type: EMPTY_DATA,
          payload: {
            cab: '',
            allCabData: [],
            isAll: false,
            isSelected: true,
            selectedIndex: 'no',
            selectedCab: result,
          }
        });
        this.router.navigate(['/track/selected']);
      }
    });
  }


  checkUpdate(cab, res, date) {
    // console.log(cab.name)
    if (res.updatedAt) {
      let update = new Date(res.updatedAt);
      if ((date.getFullYear() == update.getFullYear()) && (date.getDay() == update.getDay()) && (date.getMonth() == update.getMonth())) {
        // console.log(moment.duration(moment.utc(date).diff(moment.utc(update)))['_data']['minutes'])
        if (moment.duration(moment.utc(date).diff(moment.utc(update)))['_data']['minutes'] > 0) {
          cab.isOnline = false;
        }
        else {
          cab.isOnline = true;
        }
      }
      else {
        cab.isOnline = false;
      }
    }
    else {
      cab.isOnline = false;
    }
    if (this.mapFor == 'single') {
      
      let selectedcab = this.allCabs[this.selectedIndex];
      this.allCabs = this.allCabs.sort((a, b) => b.isOnline - a.isOnline);
      this.selectedIndex = this.allCabs.findIndex(element => {
        return element._id == selectedcab._id;
      })
    }
    else {
      this.allCabs = this.allCabs.sort((a, b) => b.isOnline - a.isOnline)
    }
   

  }

  isonline(event) {
    this.selectedIndex = 0;
    if (event.value == 'online') {
      this.getCabs({ search: this.searchData })
      this.radio = 1;
      // this.onlineFilter = { online: true }
    }
    else if (event.value == 'all') {
      this.getCabs({ search: this.searchData });
      this.radio = 0;
      // this.onlineFilter = {}
    }
    else {
      
      this.getCabs({ online: 'false', search: this.searchData })
      // this.onlineFilter = { online: false }
    }
  }

  search(event) {
    this.searchData = event.target.value;
    this.getCabs({ ...{ search: event.target.value }});
  }

  ngOnDestroy() {
    this.socket.removeListner();
    this.mapFor = '';
  }



}
