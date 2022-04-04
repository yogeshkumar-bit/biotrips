import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, ValidatorFn, AbstractControl, Validators } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common/common.service';
import { SnackbarService } from 'src/app/core/utils/snackbar/snackbar.service';
import { MatDialogRef } from '@angular/material';
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
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.scss']
})
export class CreateEmployeeComponent implements OnInit {
  form;
  allCompanies;
  group;
  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private msg: SnackbarService,
    private dialogRef: MatDialogRef<CreateEmployeeComponent>,
    private zone: NgZone,
  ) {
    this.group = this.commonService.group();
  }

  ngOnInit() {
    this.createForm();
    this.getCompanies();
  }

  createForm() {
    this.form = this.fb.group({
      employee_id: [''],
      email: ['', [patternValidator(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      password: [''],
      name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.minLength(10),
      Validators.maxLength(10),]],
      employeeDetails: this.fb.group({
        company: [''],
        emergency_number:['']
      }),
      address: this.fb.group({
        lineOne: ['', Validators.required],
        // lineTwo: [''],
        // city: ['', Validators.required],
        // area: ['', Validators.required],
        // state: ['', Validators.required],
        // pin: ['', Validators.required],
        lat: [''],
        long: [''],
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

  getCompanies(params?) {
    this.commonService.getCompanies(params).subscribe(res => {
      this.allCompanies = res['data'];
    },
      (err) => {

      }
    )
  }



  addEmployee(data) {
    data.address ={
      lineOne:data.address.lineOne,
      location:{
        //todo : piyush GUPTA
        lat:data.address.lat,
        long:data.address.long

        // lat:16.0,
        // long:25.5
      }
    }
    data.employeeDetails.employee_id = data.employee_id;
    data.employee_id = '';
    data.employeeDetails = lodash.pickBy(data.employeeDetails,lodash.identity)
    this.commonService.createEmployee(data).subscribe(
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
