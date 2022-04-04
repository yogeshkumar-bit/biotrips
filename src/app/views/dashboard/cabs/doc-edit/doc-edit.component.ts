import { Component, OnInit, Inject } from '@angular/core';
import { ValidatorFn, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common/common.service';
import * as moment from 'moment';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SnackbarService } from 'src/app/core/utils/snackbar/snackbar.service';
import { group } from '@angular/animations';

export interface MatData {
  data;
}

@Component({
  selector: 'app-doc-edit',
  templateUrl: './doc-edit.component.html',
  styleUrls: ['./doc-edit.component.scss']
})
export class DocEditComponent implements OnInit {
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
  editData;
  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private dialogRef: MatDialogRef<DocEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MatData,
    private msg: SnackbarService
  ) {
    console.log(this.data)
    this.editData =this.data;
   }

  ngOnInit() {
    this.createForm();
  }

  createForm(): void {
    this.form = this.fb.group({
      rc_exp_date: [this.data['data']['cab_rc']?this.data['data']['cab_rc']['exp_date']:''],    
      ins_exp_date: [this.data['data']['cab_insurance']?this.data['data']['cab_insurance']['exp_date']:''],
      pol_exp_date: [this.data['data']['cab_pollution_crt']?this.data['data']['cab_pollution_crt']['exp_date']:''],
      fit_exp_date: [this.data['data']['fitness']?this.data['data']['fitness']['exp_date']:''],
      per_exp_date: [this.data['data']['permit']?this.data['data']['permit']['exp_date']:''],
      tax_exp_date: [this.data['data']['tax']?this.data['data']['tax']['exp_date']:''],
    });
  }

  editCab(data) {
    let formData = new FormData;   
   
   if(this.editData['val'] == 'ins') {
    if(this.insImage){
      formData.append('cab_insuranceImage', this.insImage);
    }
      let fData = {
        exp_date: data.ins_exp_date?moment.utc(data.ins_exp_date).format():null,
        status:'verified'
      }
      formData.append('cab_insurance', JSON.stringify(fData));

    }
    else if(this.editData['val'] == 'rc') {
      if(this.rcImage){
      formData.append('cab_rcImage', this.rcImage);
      }
      let fData = {
        exp_date: data.rc_exp_date?moment.utc(data.rc_exp_date).format():null,
        status:'verified'
      }
      formData.append('cab_rc', JSON.stringify(fData));

    }
    else if(this.editData['val'] == 'pol') {
      if(this.polImage){
      formData.append('cab_pollution_crtImage', this.polImage);
    }
      let fData = {
        exp_date: data.pol_exp_date?moment.utc(data.pol_exp_date).format():null,
        status:'verified'
      }
      formData.append('cab_pollution_crt', JSON.stringify(fData));

    }
    else if(this.editData['val'] == 'fit') {
      if(this.fitImage){
      formData.append('fitnessImage', this.fitImage);
      }
      let fData = {
        exp_date: data.fit_exp_date?moment.utc(data.fit_exp_date).format():null,
        status:'verified'
      }
      formData.append('fitness', JSON.stringify(fData));
    }
    else if(this.editData['val'] == 'per') {
      if(this.perImage){
      formData.append('permitImage', this.perImage);
      }
      let fData = {
        exp_date: data.per_exp_date?moment.utc(data.per_exp_date).format():null,
        status:'verified'
      }
      formData.append('permit', JSON.stringify(fData));

    }
    else{
      if(this.taxImage){
      formData.append('taxImage', this.taxImage);
      }
      let fData = {
        exp_date: data.tax_exp_date?moment.utc(data.tax_exp_date).format():null,
        status:'verified'
      }
      formData.append('tax', JSON.stringify(fData));
    }

    this.commonService.updateCab(this.data['data']['_id'],formData).subscribe(
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

  closeModal(){
    this.dialogRef.close();
  }

}
