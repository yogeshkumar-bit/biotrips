import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common/common.service';
import { MatDialog } from '@angular/material';
import { EditVendorComponent } from '../edit-vendor/edit-vendor.component';
import { DeleteVendorComponent } from '../delete-vendor/delete-vendor.component';

@Component({
  selector: 'app-single-vendor',
  templateUrl: './single-vendor.component.html',
  styleUrls: ['./single-vendor.component.scss']
})
export class SingleVendorComponent implements OnInit {
  singleVendor;
  vendorId;
  group;
  constructor(
    private route:ActivatedRoute,
    private common:CommonService,
    private dialog: MatDialog,
    private router:Router
  ) { 
    this.route.params.subscribe(res =>{
      this.vendorId = res['id'];
    });
    this.group = this.common.group();
  }

  ngOnInit() {
    this.getVendor();
  }

  getVendor(){
    this.common.singleVendor(this.vendorId).subscribe(res =>{
      this.singleVendor = res['data'];
    },
    (err =>{

    }))
  }

  editVendor(data){
    let dialogRef = this.dialog.open(EditVendorComponent, {
      height: '100%',
      width: '350px',
      position: {
        right: '0'
      },
      data:data
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.getVendor();
      }       
    });
  }

  deleteVendor(data){
    let dialogRef = this.dialog.open(DeleteVendorComponent, {
      // height: '100%',
      width: '350px',
      position: {
        top: '0'
      },
      data:data
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.router.navigate(['/vendors'])
      }       
    });
  }

  singleCab(cab){
    this.router.navigate(['/cabs',cab._id])
  }

  singleCompany(company){
    this.router.navigate(['/companies',company._id])
  }

}
