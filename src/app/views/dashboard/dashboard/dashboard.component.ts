import { Component, OnInit, ChangeDetectorRef, OnDestroy, ViewChild } from '@angular/core';
import { BreakpointObserver, MediaMatcher } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { MatSidenav } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/core/services/common/common.service';
import { SnackbarService } from 'src/app/core/utils/snackbar/snackbar.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnDestroy, OnInit {
  @ViewChild('drawer') public sidenav: MatSidenav;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(['(max-width: 600px)'])
    .pipe(
      map(result => result.matches)
    );
    user;
  allNotif;
  group;
  vendor;
  allExpiredNot =[];
  allUpcomingNot=[];
  selectedFile;
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private breakpointObserver: BreakpointObserver,
    private fb: FormBuilder,
    private router: Router,
    private common:CommonService,
    // private store:Store<any>,
    private route:ActivatedRoute,
    private msg:SnackbarService
  ) {
    this.user = localStorage.getItem('userData');
    this.user = JSON.parse(this.user);
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.group = this.common.group();
    if(this.group == 3){
      this.getVendor();
    }
  }


  ngOnInit() {
   this.getExpiryCabs();
  }


  logout() {
    window.localStorage.clear();
    this.router.navigate(['/login']);
  }


  closeSidenavOnMobileScreen() {
    this.mobileQuery.matches ? this.sidenav.close() : this.sidenav.open();
  }

  getVendor(){
    this.common.singleVendor(this.user._id).subscribe(res =>{
      this.vendor= res['data'];
    },(err) =>{

    })
  }




  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  getExpiryCabs(){
    this.common.expiryCabs()
    .subscribe(
      (res) =>{
        this.allExpiredNot=[];
        this.allUpcomingNot=[];
        res['data'].forEach(element => {
          let expiringDocuments = [];
          let upcomingDocuments = [];
          element.expiringDocuments.forEach(doc => {
            //console.log(doc)
            if(new Date(doc.exp_date) < new Date()){ 
              expiringDocuments.push(doc);
            }
            else{
              upcomingDocuments.push(doc);
            }
          });
          if(expiringDocuments.length>0){
            this.allExpiredNot.push({
              name:element.name,
              expiringDocuments:expiringDocuments
            })
          }
          if(upcomingDocuments.length>0){
            this.allUpcomingNot.push({
              name:element.name,
              expiringDocuments:upcomingDocuments
            })
          }
        });
        this.allNotif = this.allExpiredNot.concat(this.allUpcomingNot)
        },
        (err) =>{

        }
      
    )
  }


  gotoCab(cab){
    console.log(cab)
    this.router.navigate(['/cabs',cab.name._id])
  }

  fileChange(event){
    this.selectedFile = event.target.files[0];
    console.log(event);
    if(this.selectedFile){
      this.editLogo();
    }
  }

  editLogo(){
    let formData = new FormData();
    formData.append('logoImage',this.selectedFile)
    this.common.updateLogo(formData).subscribe(res =>{
      this.msg.openSnackBar(res['message']);
      this.getVendor();
    },(err) =>{
      this.msg.openSnackBar(err);
    })
  }

  
}
