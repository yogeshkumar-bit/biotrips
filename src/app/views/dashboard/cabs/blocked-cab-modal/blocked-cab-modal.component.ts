import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-blocked-cab-modal',
  templateUrl: './blocked-cab-modal.component.html',
  styleUrls: ['./blocked-cab-modal.component.scss']
})
export class BlockedCabModalComponent implements OnInit {
  editData;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<BlockedCabModalComponent>,
  ) { 
    this.editData= this.data;
  }

  ngOnInit() {
    console.log(this.data);
  }

}
