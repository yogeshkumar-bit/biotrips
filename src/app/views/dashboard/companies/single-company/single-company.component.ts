import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common/common.service';
import { MatDialog } from '@angular/material';
import { EditCompanyComponent } from '../edit-company/edit-company.component';
import { DeleteCompanyComponent } from '../delete-company/delete-company.component';
import { AssignVendorComponent } from '../assign-vendor/assign-vendor.component';
import { RemoveCabComponent } from '../remove-cab/remove-cab.component';
import { RemoveVendorComponent } from '../remove-vendor/remove-vendor.component';
import { AddZoneComponent } from '../add-zone/add-zone.component';

@Component({
  selector: 'app-single-company',
  templateUrl: './single-company.component.html',
  styleUrls: ['./single-company.component.scss']
})
export class SingleCompanyComponent implements OnInit {
  singleCompany;
  companyId;
  group;
  constructor(
    private route:ActivatedRoute,
    private common:CommonService,
    private dialog:MatDialog,
    private router:Router
  ) { 
    this.route.params.subscribe(res =>{
      this.companyId = res['id'];
    });
    this.group = this.common.group();
  }

  ngOnInit() {
    this.getCompany();
   
  }

  getCompany(){
    this.common.singleCompany(this.companyId).subscribe(res =>{
      this.singleCompany = res['data'];
      // console.log(this.singleCompany);
    },
    (err =>{

    }))
  }

  editCompany(data){
    let dialogRef = this.dialog.open(EditCompanyComponent, {
      height: '100%',
      width: '350px',
      position: {
        right: '0'
      },
      data:data
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.getCompany();
      }     
    });
  }

  deleteCompany(data){
    let dialogRef = this.dialog.open(DeleteCompanyComponent, {
      // height: '100%',
      width: '350px',
      position: {
        top: '0'
      },
      data:data
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.router.navigate(['/companies']);
      }     
    });
  }

  assignVendor(data){
    let dialogRef = this.dialog.open(AssignVendorComponent, {
      height: '100%',
      width: '350px',
      position: {
        right: '0'
      },
      data:data
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.getCompany();
      }     
    });
  }

  removeCab(data){
    let dialogRef = this.dialog.open(RemoveCabComponent, {
      // height: '100%',
      width: '350px',
      position: {
        top: '0'
      },
      data:{
        cab:data._id,
        company:this.companyId
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.getCompany();
      }     
    });
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
        company:this.companyId
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.getCompany();
      }     
    });
  }

  addZone(val){
    let dialogRef = this.dialog.open(AddZoneComponent, {
      height: '100%',
      width: '350px',
      position: {
        right: '0'
      },
      data:{
        val:val,
        data:this.singleCompany
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.getCompany();
      }     
    });
  }

  singleVendor(vendor){
    this.router.navigate(['/vendors',vendor._id])
  }

  singleCab(cab){
    this.router.navigate(['/cabs',cab._id])
  }

}
