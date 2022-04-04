import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/core/services/common/common.service';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { DeleteShiftComponent } from './delete-shift/delete-shift.component';
import { CreateShiftComponent } from './create-shift/create-shift.component';
import { EditShiftComponent } from './edit-shift/edit-shift.component';
import { AddZoneComponent } from '../companies/add-zone/add-zone.component';


@Component({
  selector: 'app-shifts',
  templateUrl: './shifts.component.html',
  styleUrls: ['./shifts.component.scss']
})
export class ShiftsComponent implements OnInit {

  allShifts;
  user;
  allZones;
  company;
  constructor(
    private common: CommonService,
    private dialog:MatDialog,
    private router:Router
  ) {
    this.user = JSON.parse(localStorage.getItem('userData'));
    if(this.user.group == 2){
      this.getCompany();
    }
   }

  ngOnInit() {
    this.getShifts();
  }


  getCompany(){
    this.common.singleCompany(this.user['_id']).subscribe(res=>{
      this.company= res['data'];
      this.allZones = res['data']['companyDetails']?res['data']['companyDetails']['zone']?res['data']['companyDetails']['zone']:[]:[];
    })
  }


  getShifts(params?) {
    this.common.getShifts(params).subscribe(res => {
      console.log(res)
      this.allShifts = res['data'];
    },
      (err) => {

      }
    )
  }

  addShift(){
    let dialogRef = this.dialog.open(CreateShiftComponent, {
      height: '100%',
      width: '350px',
      position: {
        right: '0'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
       if(result){
         this.getShifts();
       }
    });
  }

  editShift(data){
    let dialogRef = this.dialog.open(EditShiftComponent, {
      height: '100%',
      width: '350px',
      position: {
        right: '0'
      },
      data:data
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.getShifts();
      }       
    });
  }

  deleteShift(data){
    let dialogRef = this.dialog.open(DeleteShiftComponent, {
      // height: '100%',
      width: '350px',
      position: {
        top: '0'
      },
      data:data
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.getShifts();
      }       
    });
  }

  singleShift(shift){
    this.router.navigate(['/shifts',shift._id])
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
        data:this.company
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.getCompany();
      }     
    });
  }

}