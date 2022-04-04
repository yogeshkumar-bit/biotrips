import { Component, OnInit } from '@angular/core';
import { ValidatorFn, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common/common.service';
import * as moment from 'moment';
import { MatDialogRef } from '@angular/material';
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

@Component({
  selector: 'app-create-cab',
  templateUrl: './create-cab.component.html',
  styleUrls: ['./create-cab.component.scss']
})
export class CreateCabComponent implements OnInit {
  form;
  rcImage;
  insImage;
  polImage;
  fitImage;
  perImage;
  taxImage;
  allCompanies;
  allVendors;
  show;
  group;
  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private dialogRef: MatDialogRef<CreateCabComponent>,
    private msg: SnackbarService
  ) {
    this.group = this.commonService.group();
  }

  ngOnInit() {
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
      // email: ['', [Validators.required, patternValidator(/^(([^<>()\[\]\\.
      // ,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.
      // [0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      // phone: ['', Validators.required],
      name: ['', Validators.required],
      rc_exp_date: [''],
      ins_exp_date: [''],
      pol_exp_date: [''],
      fit_exp_date: [''],
      per_exp_date: [''],
      tax_exp_date: [''],
      cab_number: ['', Validators.required],
      cab_model: ['', Validators.required],
      // company: [''],
      vendor: [''],
    });
  }

  addCab(data) {
    let formData = new FormData;
    formData.append('name', data.name);
    // formData.append('phone',data.phone);
    // formData.append('email',data.email);
    if (this.rcImage) {
      formData.append('cab_rcImage', this.rcImage);
    }
    if (this.insImage) {
      formData.append('cab_insuranceImage', this.insImage);

    }
    if (this.polImage) {
      formData.append('cab_pollution_crtImage', this.polImage);

    }
    if (this.fitImage) {
      formData.append('fitnessImage', this.fitImage);

    }
    if (this.perImage) {
      formData.append('permitImage', this.perImage);

    }
    if (this.taxImage) {
      formData.append('taxImage', this.taxImage);

    }

    if (data.rc_exp_date) {
      let fData = {
        exp_date: moment.utc(data.rc_exp_date).format(),
        status:'verified'
      }
      formData.append('cab_rc', JSON.stringify(fData));
    }
    if (data.ins_exp_date) {
      let fData = {
        exp_date: moment.utc(data.ins_exp_date).format(),
        status:'verified'
      }
      formData.append('cab_insurance', JSON.stringify(fData));
    }
    if (data.pol_exp_date) {
      let fData = {
        exp_date: moment.utc(data.pol_exp_date).format(),
        status:'verified'
      }
      formData.append('cab_pollution_crt', JSON.stringify(fData));
    }
    if (data.tax_exp_date) {
      let fData = {
        exp_date: moment.utc(data.tax_exp_date).format(),
        status:'verified'
      }
      formData.append('tax', JSON.stringify(fData));
    }

    if (data.fit_exp_date) {
      let fData = {
        exp_date: moment.utc(data.fit_exp_date).format(),
        status:'verified'
      }
      formData.append('fitness', JSON.stringify(fData));
    }
    if (data.per_exp_date) {
      let fData = {
        exp_date: moment.utc(data.per_exp_date).format(),
        status:'verified'
      }
      formData.append('permit', JSON.stringify(fData));
    }


    formData.append('cab_number', data.cab_number);
    formData.append('cab_model', data.cab_model);

    if(data.vendor){
      formData.append('vendor', data.vendor);
    }
    // if(data.company){
    //   formData.append('assignedTo', JSON.stringify([data.company]));
    // }

    this.commonService.addCab(formData).subscribe(
      (res) => {
        this.msg.openSnackBar(res['message']);
        this.dialogRef.close(true);
        this.form.reset();

      },
      (err) => {
        console.log(err);
        this.msg.openSnackBar(err);
      }
    );
  }

  onFileInput(event, val) {
    if (val === 'rc') {
      this.rcImage = event.target.files[0];
    } else if (val === 'ins') {
      this.insImage = event.target.files[0];
    } else if (val === 'fit') {
      this.fitImage = event.target.files[0];
    } else if (val === 'per') {
      this.perImage = event.target.files[0];
    } else if (val === 'tax') {
      this.taxImage = event.target.files[0];
    } else {
      this.polImage = event.target.files[0];
    }
  }



  getVendors() {
    this.commonService.getVendors('').subscribe(
      (res) => {
        console.log(res);
        this.allVendors = res['data'];
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getCompanies(params?) {
    this.commonService.getCompanies(params).subscribe(res => {
      this.allCompanies = res['data'];
    },
      (err) => {

      }
    )
  }

  closeModal(){
    this.dialogRef.close();
  }

}
