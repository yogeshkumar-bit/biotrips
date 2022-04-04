import { CommonService } from './../../../../core/services/common/common.service';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

export interface MatData {}

@Component({
  selector: 'app-export-preview',
  templateUrl: './export-preview.component.html',
  styleUrls: ['./export-preview.component.scss']
})
export class ExportPreviewComponent implements OnInit {
  displayedColumns: string[] = ['vendor', 'cab_number', 'driver','driver-phone','licence', 'permit', 'fitness','pollution', 'insurance'];
  allCabs;
  constructor(private http: CommonService,
  private dialogRef:MatDialogRef<ExportPreviewComponent>
  ) {
    
   }

  ngOnInit() {
    this.getCabs();
  }

  getCabs(){
    this.http.getCabs().subscribe(res =>{
      this.allCabs = res;
    },(err) =>{
      
    })
  }

  export() {
    this.http.export();
  }

  closeModal(){
    this.dialogRef.close();
  }

}
