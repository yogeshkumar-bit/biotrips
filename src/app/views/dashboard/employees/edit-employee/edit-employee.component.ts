import { Component, OnInit, Inject, NgZone } from '@angular/core';
import { FormBuilder, ValidatorFn, AbstractControl, Validators } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common/common.service';
import { SnackbarService } from 'src/app/core/utils/snackbar/snackbar.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
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

export interface MatData {
  data;
}

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.scss']
})
export class EditEmployeeComponent implements OnInit {
  form;
  allCompanies;
  group;
  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private msg: SnackbarService,
    private dialogRef: MatDialogRef<EditEmployeeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MatData,
    private zone:NgZone
  ) { 
    this.group = this.commonService.group();
  }

  ngOnInit() {
    console.log(this.data)
    this.createForm();
    this.getCompanies();
    
    
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

  createForm(){
    
    this.form = this.fb.group({
      employee_id:[this.data['employeeDetails']?this.data['employeeDetails']['employee_id']:''],
      email: [this.data['email']?this.data['email']:'', [patternValidator(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      // password: [''],
      name: [this.data['name']?this.data['name']:''],
      phone: [this.data['phone']?this.data['phone']:'', [Validators.minLength(10),
      Validators.maxLength(10),]],
      employeeDetails: this.fb.group({
        company: [this.data['employeeDetails']?this.data['employeeDetails']['company']['_id']:''],
        emergency_number:[this.data['employeeDetails']?this.data['employeeDetails']['emergency_number']?this.data['employeeDetails']['emergency_number']:'':'']
      }),
      address: this.fb.group({
        lineOne: [this.data['address']['lineOne']?this.data['address']['lineOne']:''],
        // lineTwo: [this.data['address']['lineTwo']?this.data['address']['lineTwo']:''],
        // city: [this.data['address']['city']?this.data['address']['city']:'', Validators.required],
        // area: [this.data['address']['area']?this.data['address']['area']:'', Validators.required],
        // state: [this.data['address']['state']?this.data['address']['state']:'', Validators.required],
        // pin: [this.data['address']['pin']?this.data['address']['pin']:'', Validators.required],
        lat:[ this.data['address']['location']['lat']?this.data['address']['location']['lat']:''],
        long:[this.data['address']['location']['long']?this.data['address']['location']['long']:''],
      }),
      // gst_number: ['', Validators.required]
  
    });
  }

  getCompanies(params?) {
    this.commonService.getCompanies(params).subscribe(res => {
      this.allCompanies = res['data'];
    },
      (err) => {

      }
    )
  }



editEmployee(data) {
  data.employeeDetails.employee_id = data.employee_id;
  data.employee_id ='';
  data.employeeDetails = lodash.pickBy(data.employeeDetails,lodash.identity);
  this.commonService.updateEmployee(this.data['_id'],data).subscribe(
    (res) => {
      this.form.reset();
      this.dialogRef.close(true);
      this.msg.openSnackBar(res['message']);
    },
    (err) => {
      console.log(err)
      this.msg.openSnackBar(err);
    }
  )
}

closeModal(){
  this.dialogRef.close();
}

}
