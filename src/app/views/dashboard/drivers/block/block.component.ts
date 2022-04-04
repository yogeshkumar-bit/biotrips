import { Component, OnInit, Inject } from '@angular/core';
import { CommonService } from 'src/app/core/services/common/common.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { SnackbarService } from 'src/app/core/utils/snackbar/snackbar.service';
import {pickBy,identity} from 'lodash';
import { FormBuilder } from '@angular/forms';

export interface MatData {
  data;
}
@Component({
  selector: 'app-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.scss']
})
export class BlockComponent implements OnInit {
  editData;
  allCompanies=[];
  group;
  
  constructor(
    private commonService: CommonService,
    @Inject(MAT_DIALOG_DATA) public data: MatData,
    private msg: SnackbarService,
    private dialogRef: MatDialogRef<BlockComponent>,  
    private fb:FormBuilder 
  ) { 
    this.group = this.commonService.group();
    this.editData = this.data['val'];
  }
  form = this.fb.group({
    company:['']
  })

  ngOnInit() {
    if(this.group == 1){
      this.getCompanies();
    }
    else{
      let user = JSON.parse(localStorage.getItem('userData'));
      this.form.controls.company.setValue([user._id]);
    }
  }

  getCompanies(){
    this.commonService.getCompanies().subscribe(res =>{
      this.allCompanies = res['data'];
      console.log(this.editData,this.data['driver']['driverDetails']['blacklistCompany'])
      if(!this.editData){
        this.form.controls.company.setValue(this.data['driver']['driverDetails']['blacklistCompany']);
      }
    })
  }

  delete(data){
    let companyData=[];
    if(this.editData){
      if(this.group == 1){
        companyData = data.company;
      }
      else{
        companyData = this.data['driver']['driverDetails']['blacklistCompany']?this.data['driver']['driverDetails']['blacklistCompany']:[];
        companyData = companyData.concat(data.company)
      }
    }
    else{
      if(this.group == 1){
        companyData = data.company;
      }
      else{
        companyData = this.data['driver']['driverDetails']['blacklistCompany']?this.data['driver']['driverDetails']['blacklistCompany']:[];
        let index = companyData.findIndex(element =>{
          return element._id == data.company[0]
        });
        companyData.splice(index,1);
      }
    }

    let formData = new FormData();
    formData.append('driverDetails',JSON.stringify({blacklistCompany:companyData}))
    this.commonService.updateDriver(this.data['driver']['_id'],formData).subscribe(res =>{
      this.msg.openSnackBar(res['message']);
      this.dialogRef.close(true);
    },(err) =>{
      this.msg.openSnackBar(err);
    })
  }

}
