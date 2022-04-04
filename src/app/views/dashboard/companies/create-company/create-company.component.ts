import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common/common.service';
import { MatDialogRef } from '@angular/material';
import { SnackbarService } from 'src/app/core/utils/snackbar/snackbar.service';
import * as lodash from 'lodash';

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
  selector: 'app-create-company',
  templateUrl: './create-company.component.html',
  styleUrls: ['./create-company.component.scss']
})
export class CreateCompanyComponent implements OnInit {
  form;
  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private msg: SnackbarService,
    private dialogRef: MatDialogRef<CreateCompanyComponent>,
    private zone:NgZone
  ) { }

  ngOnInit() {
    this.createForm();
  }

  createForm(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, patternValidator(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      password: ['', Validators.required],
      name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.minLength(10),
      Validators.maxLength(10)]],
      companyDetails: this.fb.group({
        owner_name: ['', Validators.required],
        gst_number:['']
      }),
      address: this.fb.group({
        lineOne: ['', Validators.required],
        // lineTwo: [''],
        // city: ['', Validators.required],
        // area: ['', Validators.required],
        // state: ['', Validators.required],
        // pin: ['', Validators.required],
        lat:[''],
        long:['']
      }),

      // gst_number: ['', Validators.required]

    });
  }

  setAddress(addrObj) {
    console.log({ addrObj });
    // We are wrapping this in a NgZone to reflect the changes
    // to the object in the DOM.
    let addr;
    this.zone.run(() => {
      addr = addrObj;
    });
    let address = []
    if (addr['name']) {
      address.push(addr['name']);
    }
    if (addr['subArea1']) {
      address.push(addr['subArea1']);

    }
    if (addr['subArea2']) {
      address.push(addr['subArea2']);

    }
    if (addr['area']) {
      address.push(addr['area']);

    }
    if (addr['locality']) {
      address.push(addr['locality']);

    }
    if (addr['admin_area_l1']) {
      address.push(addr['admin_area_l1']);
    }

    var uniq = lodash.uniqBy(address, function (o) {
      return o;
    });

    let lineOne = '';
    uniq.forEach((element,index) => {
      lineOne = lineOne + element;
      if(index != (uniq.length -1)){
        lineOne = lineOne + ', '
      }
    });
    this.form.controls['address']['controls']['lineOne'].setValue(lineOne);
 
    this.form.controls['address']['controls']['lat'].setValue(addr['lat']);
    this.form.controls['address']['controls']['long'].setValue(addr['lng']);
   
  }

  addCompany(data) {
    data.address ={
      lineOne:data.address.lineOne,
      location:{
        // 
        lat:data.address.lat,
        long:data.address.long
      }
    }
    this.commonService.addCompany(data).subscribe(
      (res) => {
        this.form.reset();
        this.dialogRef.close(true);
        this.msg.openSnackBar(res['message']);
      },
      (err) => {
        console.log(err);
        this.msg.openSnackBar(err);
      }
    )
  }

  closeModal(){
    this.dialogRef.close();
  }
}
