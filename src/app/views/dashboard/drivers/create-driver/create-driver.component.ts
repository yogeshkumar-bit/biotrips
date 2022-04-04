import { Component, OnInit } from '@angular/core';
import { ValidatorFn, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common/common.service';
import * as moment from 'moment';
import { MatDialogRef } from '@angular/material';
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

@Component({
  selector: 'app-create-driver',
  templateUrl: './create-driver.component.html',
  styleUrls: ['./create-driver.component.scss']
})
export class CreateDriverComponent implements OnInit {
  form;
  show;
  group;
  licenceImage;
  policeImage;
  allCompanies;
  allVendors;
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
    private msg:SnackbarService,
    private dialogRef: MatDialogRef<CreateDriverComponent>,
  ) {
    this.group = this.commonService.group();
   }

  ngOnInit() {
    this.createForm();
    if(this.group != 3){
      this.getVendors();
    }
  }

  createForm(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required,patternValidator(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      phone: ['', [Validators.required,Validators.minLength(10),
        Validators.maxLength(10)]],
      name: ['', Validators.required],
      password: ['', Validators.required],
      dlNo: ['', Validators.required],
      owner: ['', Validators.required],
      lic_exp_date: [''],
      pol_exp_date: [''],
      // address: this.fb.group({
      //   lineOne: ['', Validators.required],
      //   lineTwo: [''],
      //   city: ['', Validators.required],
      //   area: ['', Validators.required],        
      //   state: ['', Validators.required],
      //   pin: ['', Validators.required],
      // }),
      vendor: [''],
    });
  }

  addDriver(data){
    let formData = new FormData;
    formData.append('name',data.name);
    formData.append('phone',data.phone);
    formData.append('email',data.email);
    

    if(this.licenceImage){
      formData.append('licenceImage',this.licenceImage);
    }
    if(this.policeImage){
      formData.append('policeImage',this.policeImage);
    }

    formData.append('password',data.password);
    let driverDetails:any ={
      vendor:data.vendor?data.vendor:'',
      dlNo:data.dlNo?data.dlNo:'',
    }

    if(data.lic_exp_date){
      data.lic_exp_date = moment.utc(data.lic_exp_date).format();
      driverDetails.verification = {
        exp_date:data.pol_exp_date,
        status:'verified'
      }
      
    }
    if(data.pol_exp_date){
      data.pol_exp_date = moment.utc(data.pol_exp_date).format();
      driverDetails.license = {
        exp_date:data.lic_exp_date,
        status:'verified'
      }
    }

    driverDetails = pickBy(driverDetails,identity);
    driverDetails.owner = data.owner?data.owner:false,
    formData.append('driverDetails',JSON.stringify(driverDetails));
    

    this.commonService.addDriver(formData).subscribe(
      (res) =>{
        this.msg.openSnackBar(res['message']);
        this.dialogRef.close(true);
        this.form.reset();
      },
      (err) =>{
        console.log(err);
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

  closeModal(){
    this.dialogRef.close();
  }
}
