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
  selector: 'app-create-payment',
  templateUrl: './create-payment.component.html',
  styleUrls: ['./create-payment.component.scss']
})
export class CreatePaymentComponent implements OnInit {
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
    private dialogRef: MatDialogRef<CreatePaymentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MatData,
  ) {
    let date = new Date();
    let year = date.getFullYear();
    for(let i=2019; i<=year;i++){
      console.log(i);
      this.allYears.push(i);
    }
    this.group = this.commonService.group();
  }

  ngOnInit() {
    this.createForm();
    this.getCompanies();
  }

  createForm() {
    this.form = this.fb.group({
      // number_of_trips: ['', Validators.required],
      month:[''],
      year:[''],
      earnings: this.fb.array([
        this.fb.group({
          company: [''],
          trips: [''],
          amount: [''],
          description:['']
        })
      ]),
      deductions: this.fb.array([
        this.fb.group({
          deductionFor: [''],
          amount: ['']
        })
      ]),
      tds: [''],
      totalEarnings: [''],
      totalDeductions: [''],
      netAmount: [''],
      totalAmount: [''],
    });

    this.formChanges = this.form.valueChanges;

    this.formChanges.subscribe(res => {
      if(res){
        console.log(res);
        let totalEarnings = 0;
        let totalDeductions = 0;
        res.earnings.forEach(element => {
          totalEarnings = element.amount + totalEarnings;
        });
        res.deductions.forEach(element => {
          totalDeductions = element.amount + totalDeductions;
        });
        this.form['controls']['totalEarnings'].setValue(totalEarnings,{emitEvent: false});
        this.form['controls']['totalDeductions'].setValue(totalDeductions,{emitEvent: false});
        let netAmount = 0;
        netAmount = totalEarnings - totalDeductions;
        let totalAmount = netAmount;
        if(res.tds){
          totalAmount = totalAmount - (totalAmount * res.tds)/100
        }
        this.form['controls']['netAmount'].setValue(netAmount,{emitEvent: false});
        this.form['controls']['totalAmount'].setValue(totalAmount,{emitEvent: false});
      }
    });
  }

  addNewEarning() {
    let control = <FormArray>this.form.controls.earnings;
    control.push(
      this.fb.group({
        company: [''],
        trips: [''],
        amount: [''],
        description: [''],
      })
    );
  }
  deleteEarning(index) {
    let control = <FormArray>this.form.controls.earnings;
    control.removeAt(index);
  }

  addNewDeduction() {
    let control = <FormArray>this.form.controls.deductions;
    control.push(
      this.fb.group({
        deductionFor: [''],
        amount: ['']
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



  addPayment(data) {
    data.user = this.data['_id'];
    console.log(data)
    this.commonService.createPayment(data).subscribe(
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

  closeModal(){
    this.dialogRef.close();
  }
}
