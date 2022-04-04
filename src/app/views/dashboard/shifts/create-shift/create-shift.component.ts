
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common/common.service';
import { SnackbarService } from 'src/app/core/utils/snackbar/snackbar.service';
import { MatDialogRef } from '@angular/material';


@Component({
  selector: 'app-create-shift',
  templateUrl: './create-shift.component.html',
  styleUrls: ['./create-shift.component.scss']
})
export class CreateShiftComponent implements OnInit {
  form;
  allCompanies;
  group;
  allTimes = [
    { label: '1:00', value: [1, 0] }, { label: '1:30', value: [1, 30] }, { label: '2:00', value: [2, 0] }, { label: '2:30', value: [2, 30] }, { label: '3:00', value: [3, 0] }, { label: '3:30', value: [3, 30] }, { label: '4:00', value: [4, 0] }, { label: '4:30', value: [4, 30] }, { label: '5:00', value: [5, 0] }, { label: '5:30', value: [5, 30] }, { label: '6:00', value: [6, 0] }, { label: '6:30', value: [6, 30] }, { label: '7:00', value: [7, 0] }, { label: '7:30', value: [7, 30] }, { label: '8:00', value: [8, 0] }, { label: '8:30', value: [8, 30] }, { label: '9:00', value: [9, 0] }, { label: '9:30', value: [9, 30] }, { label: '10:00', value: [10, 0] }, { label: '10:30', value: [10, 30] }, { label: '11:00', value: [11, 0] }, { label: '11:30', value: [11, 30] }, { label: '12:00', value: [12, 0] }, { label: '12:30', value: [12, 30] }, { label: '13:00', value: [13, 0] }, { label: '13:30', value: [13, 30] }, { label: '14:00', value: [14, 0] }, { label: '14:30', value: [14, 30] }, { label: '15:00', value: [15, 0] }, { label: '15:30', value: [15, 30] }, { label: '16:00', value: [16, 0] }, { label: '16:30', value: [16, 30] }, { label: '17:00', value: [17, 0] }, { label: '17:30', value: [17, 30] }, { label: '18:00', value: [18, 0] }, { label: '18:30', value: [18, 30] }, { label: '19:00', value: [19, 0] }, { label: '19:30', value: [19, 30] }, { label: '20:00', value: [20, 0] }, { label: '20:30', value: [20, 30] }, { label: '21:00', value: [21, 0] }, { label: '21:30', value: [21, 30] }, { label: '22:00', value: [22, 0] }, { label: '22:30', value: [22, 30] }, { label: '23:00', value: [23, 0] }, { label: '23:30', value: [23, 30] }, { label: '24:00', value: [24, 0] }
  ];
  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private msg: SnackbarService,
    private dialogRef: MatDialogRef<CreateShiftComponent>,
  ) { 
    this.group = this.commonService.group();
  }

  ngOnInit() {
    this.createForm();
    this.getCompanies();
  }

  createForm(){
    this.form = this.fb.group({
      name: ['', Validators.required],
      endTime: ['', Validators.required],
      startTime: ['', Validators.required],
      company: [''],      

      })
  }

  getCompanies(params?) {
    this.commonService.getCompanies(params).subscribe(res => {
      this.allCompanies = res['data'];
    },
      (err) => {

      }
    )
  }



addShift(data) {
  this.commonService.createShift(data).subscribe(
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
