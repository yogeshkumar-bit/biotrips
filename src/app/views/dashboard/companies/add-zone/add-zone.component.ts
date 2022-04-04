import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common/common.service';
import { SnackbarService } from 'src/app/core/utils/snackbar/snackbar.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-add-zone',
  templateUrl: './add-zone.component.html',
  styleUrls: ['./add-zone.component.scss']
})
export class AddZoneComponent implements OnInit {
  form;
  constructor(
    private fb: FormBuilder,
    private common: CommonService,
    private msg: SnackbarService,
    @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<AddZoneComponent>,
  ) { }

  ngOnInit() {
    this.createForm();
    console.log(this.data)
    if(this.data['val'] == 'edit'){
      this.prefill(this.data['data']);
    }
  }

  createForm() {
    this.form = this.fb.group({
      zone: this.fb.array([
        this.fb.group({
          name: ['', Validators.required],
          amount: ['', Validators.required],
        })
      ]),
    });
  }

  prefill(data){
    let control = <FormArray>this.form.controls.zone;
    control.removeAt(0);
    data.companyDetails.zone.forEach(element => {
      this.addMore(element);
    });
  }


  addMore(data?) {
    let control = <FormArray>this.form.controls.zone;
    control.push(
      this.fb.group({
        name: [data?data.name:'', Validators.required],
        amount: [data?data.amount:'', Validators.required],
      })
    );
  }
  deleteZone(index) {
    let control = <FormArray>this.form.controls.zone;
    control.removeAt(index);
  }


  addZone(data) {
    console.log(data);
    this.common.updateCompany(this.data['data']['_id'], { companyDetails: data }).subscribe(res => {
      this.msg.openSnackBar(res['message']);
      this.dialogRef.close(true);
    }, (err) => {
      this.msg.openSnackBar(err);
    })
  }

}
