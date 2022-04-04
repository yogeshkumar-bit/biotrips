import { Component, OnInit, Inject } from '@angular/core';
import { CommonService } from 'src/app/core/services/common/common.service';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SnackbarService } from 'src/app/core/utils/snackbar/snackbar.service';
import { BlockedCabModalComponent } from '../blocked-cab-modal/blocked-cab-modal.component';


export interface MatData {
  data;
}
@Component({
  selector: 'app-assign-company',
  templateUrl: './assign-company.component.html',
  styleUrls: ['./assign-company.component.scss']
})
export class AssignCompanyComponent implements OnInit {
  allCompanies;
  form;
  editData;
  removeArray=[];
  constructor(
    private commonService: CommonService,
    @Inject(MAT_DIALOG_DATA) public data: MatData,
    private msg: SnackbarService,
    private dialogRef: MatDialogRef<AssignCompanyComponent>,
    private dialog:MatDialog
  ) { 
    this.editData = this.data;
  }

  ngOnInit() {
    this.getCompanies();
    this.createForm();
    console.log(this.data)
  }

  createForm() {
    this.form = new FormGroup({
      company: new FormControl('',[Validators.required])
    })
  }

  getCompanies() {
    this.commonService.getCompanies().subscribe(
      (res) => {
        this.allCompanies = res['data'];
      },
      (err) => {
        console.log(err)
      }
    )
  }

  assignCompany(data){
    console.log(this.editData)
    data.cabs = this.editData.map(element =>{
      return element._id
    });
    this.commonService.assignCompanyToCab(data).subscribe(
      (res) => {
        this.msg.openSnackBar(res['message']);
        this.dialogRef.close(res['data']);
      },
      (err) => {
        // console.log(err)
        this.msg.openSnackBar(err);
      }
    )
  }

  closeModal(){
    this.dialogRef.close();

  }

 


}
