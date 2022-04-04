import { Component, OnInit, Inject } from '@angular/core';
import { CommonService } from 'src/app/core/services/common/common.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { SnackbarService } from 'src/app/core/utils/snackbar/snackbar.service';
import { FormGroup, FormControl } from '@angular/forms';
import { pickBy,identity} from 'lodash';
export interface MatData {
  data;
}

@Component({
  selector: 'app-assign-cab',
  templateUrl: './assign-cab.component.html',
  styleUrls: ['./assign-cab.component.scss']
})
export class AssignCabComponent implements OnInit {
  allCabs;
  form;
  editData;
  constructor(
    private common: CommonService,
    @Inject(MAT_DIALOG_DATA) public data: MatData,
    private msg: SnackbarService,
    private dialogRef: MatDialogRef<AssignCabComponent>,
  ) {
    this.editData = this.data;
    console.log(this.data)
  }

  ngOnInit() {
    this.getCabs({assignedTo:this.data['company']?this.data['company']['_id']:''});
    this.form = new FormGroup({
      cab: new FormControl(this.data['cab'] ? this.data['cab']['_id'] : ''),
    })
  }

  getCabs(params?) {
    this.common.getCabs(params).subscribe(res => {
      this.allCabs = res;
    },
      (err) => {

      }
    )
  }

  assignCab(data) {
    let formData:any={
      pickupTempCab:'',
      dropTempCab:'',
      cab:'',
    };
    if (this.editData['cabFor'] == 'pickup') {
      formData.pickupTempCab = data.cab;
    }
    else if (this.editData['cabFor'] == 'drop') {
      formData.dropTempCab = data.cab;
    }
    else {
      formData.cab = data.cab;
    }

    this.common.assignCabRoute(this.data['_id'], pickBy(formData,identity)).subscribe(
      (res) => {
        this.dialogRef.close(true);
        this.msg.openSnackBar(res['message']);
      },
      (err) => {
        console.log(err)
        this.msg.openSnackBar(err);
      }
    )
  }

  searchCab(event) {
    if (event.target.value.length == 0) {
      this.getCabs();
    }
    else {
      this.getCabs({ search: event.target.value });
    }
  }

  // openedChange(event){
  //   if(event){
  //     this.getCabs();
  //     this.form.controls.cabSearch.setValue('');
  //   }
  // }


  closeModal(){
    this.dialogRef.close();
  }

}
