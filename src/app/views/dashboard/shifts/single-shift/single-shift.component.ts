import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/core/services/common/common.service';
import { MatDialog } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { DeleteShiftComponent } from '../delete-shift/delete-shift.component';
import { EditShiftComponent } from '../edit-shift/edit-shift.component';
import { CreateShiftComponent } from '../create-shift/create-shift.component';



@Component({
  selector: 'app-single-shift',
  templateUrl: './single-shift.component.html',
  styleUrls: ['./single-shift.component.scss']
})
export class SingleShiftComponent implements OnInit {
  shiftId;
  singleShift;
  constructor(
    private common: CommonService,
    private dialog:MatDialog,
    private router:Router,
    private route:ActivatedRoute
  ) { 
    this.route.params.subscribe(res =>{
      this.shiftId= res['id'];
      this.getShift(this.shiftId);
    })
  }

  ngOnInit() {
    
  }


  getShift(shiftId) {
    this.common.singleShift(shiftId).subscribe(res => {
      this.singleShift = res['data'];
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
         this.getShift(this.shiftId);
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
        this.getShift(this.shiftId);
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
        this.router.navigate(['/shifts'])
      }       
    });
  }

  singleCompany(comapny){
    this.router.navigate(['/comapnies',comapny._id])
  }

}