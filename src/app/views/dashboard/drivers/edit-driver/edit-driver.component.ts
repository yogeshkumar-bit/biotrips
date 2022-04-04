import { Component, OnInit, Inject } from '@angular/core';
import { ValidatorFn, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common/common.service';
import * as moment from 'moment';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { SnackbarService } from 'src/app/core/utils/snackbar/snackbar.service';
import {pickBy,identity} from 'lodash';

export function patternValidator(regexp: RegExp): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    const value = control.value;
    if (value === '') {
      return null;
    }
    return !regexp.test(value) ? { 'patternInvalid': { regexp } } : null;
  };
}

export interface MatData {
  data;
}

@Component({
  selector: 'app-edit-driver',
  templateUrl: './edit-driver.component.html',
  styleUrls: ['./edit-driver.component.scss']
})
export class EditDriverComponent implements OnInit {
  form;
  show;
  licenceImage;
  policeImage;
  allCompanies;
  allVendors;
  group;
  editData;
  ownerData=[
    {
      name:'Yes',
      value:true
    },
    {
      name:'No',
      value:false
    }
  ]
  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    @Inject(MAT_DIALOG_DATA) public data: MatData,
    private msg: SnackbarService,
    private dialogRef: MatDialogRef<EditDriverComponent>,
  ) { 
    this.editData = this.data;
    this.group = this.commonService.group();
    console.log(this.data)
    // this.group = JSON.parse(localStorage.getItem('group'))
  }

  ngOnInit() {
    this.createForm();
    if(this.group != 3){
      this.getVendors();
    }
  }

  createForm(): void {
    this.form = this.fb.group({
      email: [this.data?this.data['email']:'', [patternValidator(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      phone: [this.data?this.data['phone']:'',[Validators.minLength(10),
        Validators.maxLength(10)]],
      name: [this.data?this.data['name']:''],
      password: [''],
      owner: [this.data['driverDetails']['owner']?this.data['driverDetails']['owner']:false, Validators.required],
      dlNo: [this.data['driverDetails']['dlNo']?this.data['driverDetails']['dlNo']:'',Validators.required],
      lic_exp_date: [this.data['driverDetails']['license']?this.data['driverDetails']['license']['exp_date']:''],
      pol_exp_date: [this.data['driverDetails']['verification']?this.data['driverDetails']['verification']['exp_date']:''],
      // address: this.fb.group({
      //   lineOne: [this.data['driver']['address']?this.data['driver']['address']['lineOne']:'',],
      //   lineTwo: [this.data['driver']['address']?this.data['driver']['address']['lineTwo']:''],
      //   city: [this.data['driver']['address']?this.data['driver']['address']['city']:''],
      //   area: [this.data['driver']['address']?this.data['driver']['address']['area']:''],        
      //   state: [this.data['driver']['address']?this.data['driver']['address']['state']:''],
      //   pin: [this.data['driver']['address']?this.data['driver']['address']['pin']:''],
      // }),
      vendor: [this.data['driverDetails']['vendor']?this.data['driverDetails']['vendor']['_id']:''],
    });

    this.licenceImage = this.data['driverDetails']['license']?this.data['driverDetails']['license']['image']:'';
    this.policeImage = this.data['driverDetails']['verification']?this.data['driverDetails']['verification']['image']:'';
  }

  editDriver(data){
    let formData = new FormData;
    formData.append('name',data.name);
    formData.append('phone',data.phone);
    formData.append('email',data.email);
    
   
   

    // formData.append('password',data.password);
    // data.lic_exp_date = moment.utc(data.lic_exp_date).format();
    // data.pol_exp_date = moment.utc(data.pol_exp_date).format();
    let driverDetails:any ={
      vendor:data.vendor?data.vendor:'',
      // owner:data.owner?data.owner:'',
      dlNo:data.dlNo?data.dlNo:'',
      // verification:{
      //   exp_date:data.pol_exp_date
      // },
      // license:{
      //   exp_date:data.lic_exp_date
      // }
      
    }

    console.log(driverDetails)

    if(data.pol_exp_date){
      data.pol_exp_date = moment.utc(data.lic_exp_date).format();
      driverDetails.verification = {
        exp_date:data.pol_exp_date,
        status:'verified'
      }
      
    }
    if(data.lic_exp_date){
      data.lic_exp_date = moment.utc(data.pol_exp_date).format();
      driverDetails.license = {
        exp_date:data.lic_exp_date,
        status:'verified'
      }
    }
   

    if(this.licenceImage){
      if(!data.lic_exp_date){
        driverDetails.license = {
          status:'verified'
        }
      }
      formData.append('licenceImage',this.licenceImage);
    }
    if(this.policeImage){
      if(!data.pol_exp_date){
        driverDetails.verification = {
          status:'verified'
        }
      }
      formData.append('policeImage',this.policeImage);
    }

    driverDetails = pickBy(driverDetails,identity);
    driverDetails.owner = data.owner?data.owner:false,
    formData.append('driverDetails',JSON.stringify(driverDetails));

    this.commonService.updateDriver(this.data['_id'],formData).subscribe(
      (res) =>{
        this.dialogRef.close(true);
        this.form.reset();
        this.msg.openSnackBar(res['message']);
      },
      (err) =>{
        this.msg.openSnackBar(err);
      }
    )
  }

  
  onFileInput(event,val) {

    if(val == 'pol'){
      this.policeImage = event.target.files[0];
    }
    else{
      this.licenceImage = event.target.files[0];
    }
    
  }


  getVendors(){
    this.commonService.getVendors('').subscribe(
      (res) =>{
        console.log(res);
        this.allVendors =res['data'];
      },
      (err) =>{
        console.log(err)
      }
    )
  }

  select(event){
    if(event.value == '1'){
      this.show ='1';
    }
    else{
      this.show ='2';
    }
  }

  closeModal(){
    this.dialogRef.close();
  }
}
