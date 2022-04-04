import { Component, OnInit, Inject, NgZone } from '@angular/core';
import { FormBuilder, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common/common.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { SnackbarService } from 'src/app/core/utils/snackbar/snackbar.service';
import { pickBy,identity,uniqBy } from 'lodash';

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
  selector: 'app-edit-company',
  templateUrl: './edit-company.component.html',
  styleUrls: ['./edit-company.component.scss']
})
export class EditCompanyComponent implements OnInit {
  form;
  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private msg:SnackbarService,
    @Inject(MAT_DIALOG_DATA) public data: MatData,
    private dialogRef: MatDialogRef<EditCompanyComponent>,
    private zone:NgZone
  ) { }

  ngOnInit() {
    this.createForm();
    console.log(this.data)
  }

  createForm(): void {
    this.form = this.fb.group({
      email: [this.data?this.data['email']:'', [Validators.required, patternValidator(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      password: [''],
      name: [this.data?this.data['name']:''],
      phone: [this.data?this.data['phone']:'',[Validators.minLength(10),
        Validators.maxLength(10)]],
        companyDetails: this.fb.group({
          owner_name: [this.data['companyDetails']?this.data['companyDetails']['owner_name']?this.data['companyDetails']['owner_name']:'':''],
          gst_number:[this.data['companyDetails']?this.data['companyDetails']['gst_number']?this.data['companyDetails']['gst_number']:'':'']
        }),
      address: this.fb.group({
        lineOne: [this.data['address'] && this.data['address']['lineOne']?this.data['address']['lineOne']:'',],
        // lineTwo: [this.data['address'] && this.data['address']['lineTwo']?this.data['address']['lineTwo']:''],
        // city: [this.data['address'] && this.data['address']['city']?this.data['address']['city']:''],
        // area: [this.data['address'] && this.data['address']['area']?this.data['address']['area']:''],        
        // state: [this.data['address'] && this.data['address']['state']?this.data['address']['state']:''],
        // pin: [this.data['address'] && this.data['address']['pin']?this.data['address']['pin']:''],
        lat:[''],
        long:['']
      }),
      // gst_number:[this.data['company']?this.data['company']['gst_number']:''],
      // password:[''],

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

    var uniq = uniqBy(address, function (o) {
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

  editCompany(data){
    data.companyDetails = pickBy(data.companyDetails,identity);
    this.commonService.updateCompany(this.data['_id'],pickBy(data,identity)).subscribe(
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

  closeModal(){
    this.dialogRef.close();
  }
}
