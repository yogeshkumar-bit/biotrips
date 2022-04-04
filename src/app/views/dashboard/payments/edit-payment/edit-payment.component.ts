import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators, ValidatorFn, AbstractControl, FormArray } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common/common.service';
import { SnackbarService } from 'src/app/core/utils/snackbar/snackbar.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs';

export interface MatData {
  data;
}

@Component({
  selector: 'app-edit-payment',
  templateUrl: './edit-payment.component.html',
  styleUrls: ['./edit-payment.component.scss']
})
export class EditPaymentComponent implements OnInit {
  form;
  allCompanies;
  formChanges: Observable<any>
  group;
  allMonths=['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  allYears=[];
  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private msg: SnackbarService,
    private dialogRef: MatDialogRef<EditPaymentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MatData,
  ) {
    let date = new Date();
    let year = date.getFullYear();
    for(let i=2019; i<=year;i++){
      console.log(i);
      this.allYears.push(i);
    }
    this.group = this.commonService.group();
    console.log(this.data['data'])
  }

  ngOnInit() {
    this.createForm();
    this.getCompanies();
  }

  createForm() {
    this.form = this.fb.group({
      month:[this.data['data']['month']?this.data['data']['month']:''],
      year:[this.data['data']['year']?this.data['data']['year']:''],
      // number_of_trips: [this.data['data']['number_of_trips'] ? this.data['data']['number_of_trips'] : '', Validators.required],
      earnings: this.fb.array([
        this.fb.group({
          company: [''],
          trips: [''],
          amount: [''],
          description: [''],
        })
      ]),
      deductions: this.fb.array([
        this.fb.group({
          deductionFor: [''],
          amount: ['']
        })
      ]),
      tds: [this.data['data']['tds'] ? this.data['data']['tds'] : ''],
      totalEarnings: [this.data['data']['totalEarnings'] ? this.data['data']['totalEarnings'] : ''],
      totalDeductions: [this.data['data']['totalDeductions'] ? this.data['data']['totalDeductions'] : ''],
      netAmount: [this.data['data']['number_of_trips'] ? this.data['data']['number_of_trips'] : ''],
      totalAmount: [this.data['data']['totalAmount'] ? this.data['data']['totalAmount'] : ''],
    });

    this.prefill(this.data['data']);

    this.formChanges = this.form.valueChanges;

    this.formChanges.subscribe(res => {
      if (res) {
        console.log(res);
        let totalEarnings = 0;
        let totalDeductions = 0;
        res.earnings.forEach(element => {
          totalEarnings = element.amount + totalEarnings;
        });
        res.deductions.forEach(element => {
          totalDeductions = element.amount + totalDeductions;
        });
        this.form['controls']['totalEarnings'].setValue(totalEarnings, { emitEvent: false });
        this.form['controls']['totalDeductions'].setValue(totalDeductions, { emitEvent: false });
        let netAmount = 0;
        netAmount = totalEarnings - totalDeductions;
        let totalAmount = netAmount;
        if (res.tds) {
          totalAmount = totalAmount - (totalAmount * res.tds) / 100
        }
        this.form['controls']['netAmount'].setValue(netAmount, { emitEvent: false });
        this.form['controls']['totalAmount'].setValue(totalAmount, { emitEvent: false });
      }
    });
  }

  prefill(data) {
    if (data.earnings.length > 0) {
      let control = <FormArray>this.form.controls.earnings;
      control.removeAt(0);
      data.earnings.forEach(element => {
        this.addNewEarning(element);
      });
    }
    if (data.deductions.length > 0) {
      let control = <FormArray>this.form.controls.deductions;
      control.removeAt(0);
      data.deductions.forEach(element => {
        this.addNewDeduction(element);
      });
    }
  }

  addNewEarning(data?) {
    let control = <FormArray>this.form.controls.earnings;
    control.push(
      this.fb.group({
        company: [data?data.company?data.company['_id']:'':''],
        trips: [data?data.trips?data.trips:'':''],
        amount: [data?data.amount?data.amount:'':''],
        description: [data?data.description?data.description:'':''],
      })
    );
  }
  deleteEarning(index) {
    let control = <FormArray>this.form.controls.earnings;
    control.removeAt(index);
  }

  addNewDeduction(data?) {
    let control = <FormArray>this.form.controls.deductions;
    control.push(
      this.fb.group({
        deductionFor: [data?data.deductionFor?data.deductionFor:'':''],
        amount: [data?data.amount?data.amount:'':'']
      })
    );
  }
  deleteDeduction(index) {
    let control = <FormArray>this.form.controls.deductions;
    control.removeAt(index);
  }

  getCompanies(params?) {
    this.commonService.getCompanies(params).subscribe(res => {
      this.allCompanies = res['data'];
    },
      (err) => {

      }
    )
  }



  editPayment(data) {
    data.user = this.data['cab']['_id'];
    this.commonService.updatePayment(this.data['data']['_id'], data).subscribe(
      (res) => {
        this.form.reset();
        this.dialogRef.close(true);
        this.msg.openSnackBar(res['message']);
      },
      (err) => {
        this.msg.openSnackBar(err);
      }
    )
  }

  closeModal() {
    this.dialogRef.close();
  }
}
