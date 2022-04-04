import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common/common.service';
import { MatDialog } from '@angular/material';
import { EditDriverComponent } from '../edit-driver/edit-driver.component';
import { DeleteDriverComponent } from '../delete-driver/delete-driver.component';
import { ImageViewerComponent } from '../../cabs/image-viewer/image-viewer.component';
import { CreatePaymentComponent } from '../../payments/create-payment/create-payment.component';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { VerifyComponent } from '../../cabs/verify/verify.component';
import { BlockComponent } from '../block/block.component';

@Component({
  selector: 'app-single-driver',
  templateUrl: './single-driver.component.html',
  styleUrls: ['./single-driver.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class SingleDriverComponent implements OnInit {
  displayedColumns: string[] = ['trips', 'earning', 'deduction', 'netAmount', 'tds', 'total'];
  singleDriver;
  driverId;
  group;
  user;
  constructor(
    private route:ActivatedRoute,
    private common:CommonService,
    private dialog:MatDialog,
    private router:Router
  ) { 
    this.route.params.subscribe(res =>{
      this.driverId = res['id'];
    });
    this.user = JSON.parse(localStorage.getItem('userData'));
    this.group = this.common.group();
  }

  ngOnInit() {
    this.getDriver();
  }

  getDriver(){
    this.common.singleDriver(this.driverId).subscribe(res =>{
      this.singleDriver = res['data'];
    },
    (err =>{

    }))
  }

  editDriver(data){
    let dialogRef = this.dialog.open(EditDriverComponent, {
      height: '100%',
      width: '350px',
      position: {
        right: '0'
      },
      data:data
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.getDriver();
      }      
    });
  }

  // addPayment(data){
  //   let dialogRef = this.dialog.open(CreatePaymentComponent, {
  //     height: '100%',
  //     width: '350px',
  //     position: {
  //       right: '0'
  //     },
  //     data:data
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     if(result) {
  //       this.getDriver();
  //     }      
  //   });
  // }

  deleteDriver(data){
    let dialogRef = this.dialog.open(DeleteDriverComponent, {
      // height: '100%',
      width: '350px',
      position: {
        top: '0'
      },
      data:data
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.router.navigate(['/drivers'])
      }      
    });
  }

  documentPreview(){
    let imagesForPreview = [
      this.singleDriver ? this.singleDriver.driverDetails.license ? this.singleDriver.driverDetails.license.image : null : null,
      this.singleDriver ? this.singleDriver.driverDetails.verification ? this.singleDriver.driverDetails.verification.image : null : null,
    ];
    imagesForPreview = imagesForPreview.filter(element =>{
      return element != null;
    })
    let dialogRef = this.dialog.open(ImageViewerComponent, {
      height: '100%',
      minHeight: '600px',
      minWidth: '800px',
      data: imagesForPreview
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  singleVendor(vendor){
    this.router.navigate(['/vendors',vendor._id])
  }

  singleCab(cab){
    this.router.navigate(['/cabs',cab._id])
  }

  verifyDoc(key,val){
    let dialogRef = this.dialog.open(VerifyComponent, {
      // height: '100%',
      width: '350px',
      position: {
        top: '0'
      },
      data: {
        key:key,
        driver:this.driverId,
        val:val
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getDriver();
      }
    });
  }

  blackList(val){
    let dialogRef = this.dialog.open(BlockComponent, {
      // height: '100%',
      width: '350px',
      position: {
        top: '0'
      },
      data:{
        val:val,
        driver:this.singleDriver
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.getDriver();
      }      
    });
  }
}
