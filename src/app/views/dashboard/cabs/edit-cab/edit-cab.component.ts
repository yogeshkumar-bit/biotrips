import { Component, OnInit, Inject } from '@angular/core';
import { ValidatorFn, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common/common.service';
import * as moment from 'moment';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { SnackbarService } from 'src/app/core/utils/snackbar/snackbar.service';


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
  selector: 'app-edit-cab',
  templateUrl: './edit-cab.component.html',
  styleUrls: ['./edit-cab.component.scss']
})
export class EditCabComponent implements OnInit {
 form;
 show;
 group;

  allCompanies;
  allVendors;
  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private msg: SnackbarService,
    @Inject(MAT_DIALOG_DATA) public data: MatData,
    private dialogRef: MatDialogRef<EditCabComponent>,
  ) { 
    this.group = this.commonService.group();
    // this.group = JSON.parse(localStorage.getItem('group'))
  }

  ngOnInit() {
    console.log(this.data)
    this.createForm();
    if(this.group != 3){
      this.getVendors();
    }
    if(this.group != 2){
      this.getCompanies();
    }
  }

  createForm(): void {
    this.form = this.fb.group({
      // email: [this.data?this.data['email']:'', [Validators.required, patternValidator(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      // phone: [this.data?this.data['phone']:''],
      name: [this.data?this.data['name']:''],
      // rc_exp_date: [this.data['cab_rc']?this.data['cab_rc']['exp_date']:''],
      // ins_exp_date: [this.data['cab_insurance']?this.data['cab_insurance']['exp_date']:''],
      // pol_exp_date: [this.data['cab_pollution_crt']?this.data['cab_pollution_crt']['exp_date']:''],
      // fit_exp_date: [this.data['fitness']?this.data['fitness']['exp_date']:''],
      // per_exp_date: [this.data['permit']?this.data['permit']['exp_date']:''],
      // tax_exp_date: [this.data['tax']?this.data['tax']['exp_date']:''],
      cab_model: [this.data?this.data['cab_model']:''],
      cab_number: [this.data?this.data['cab_number']:''],
      // vendor: [this.data['vendor']?this.data['vendor']['_id']:''],
      // company: [this.data['assignedTo']?this.data['assignedTo']['_id']:''],
    });
  }

  editCab(data){
    let formData = new FormData;
    formData.append('name',data.name);
    // formData.append('phone',data.phone);
    // formData.append('email',data.email);
   
    // if (data.rc_exp_date) {
    //   data.rc_exp_date = moment.utc(data.rc_exp_date).format();
    //   formData.append('rc_exp_date', data.rc_exp_date);
    // }
    // if (data.ins_exp_date) {
    //   data.ins_exp_date = moment.utc(data.ins_exp_date).format();
    //   formData.append('ins_exp_date', data.ins_exp_date);
    // }
    // if (data.pol_exp_date) {
    //   data.pol_exp_date = moment.utc(data.pol_exp_date).format();
    //   formData.append('pol_exp_date', data.pol_exp_date);
    // }
    // if (data.tax_exp_date) {
    //   data.tax_exp_date = moment.utc(data.tax_exp_date).format();
    //   formData.append('tax_exp_date', data.tax_exp_date);
    // }

    // if (data.fit_exp_date) {
    //   data.fit_exp_date = moment.utc(data.fit_exp_date).format();
    //   formData.append('fit_exp_date', data.fit_exp_date);
    // }
    // if (data.per_exp_date) {
    //   data.per_exp_date = moment.utc(data.per_exp_date).format();
    //   formData.append('per_exp_date', data.per_exp_date);
    // }
    
    formData.append('cab_number',data.cab_number);
    formData.append('cab_model',data.cab_model);
    
    if(data.vendor){
      formData.append('vendor', data.vendor);
    }
    // if(data.company){
    //   formData.append('assignedTo', data.company);
    // }   

    this.commonService.updateCab(this.data['_id'],formData).subscribe(
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

  getCompanies(params?) {
    this.commonService.getCompanies(params).subscribe(res => {
      this.allCompanies = res['data'];
    },
      (err) => {

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
