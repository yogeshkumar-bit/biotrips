import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormGroup, FormControl } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common/common.service';
import * as moment from 'moment';
import { SocketService } from 'src/app/core/services/socket/socket.service';
@Component({
  selector: 'app-select-cab',
  templateUrl: './select-cab.component.html',
  styleUrls: ['./select-cab.component.scss']
})
export class SelectCabComponent implements OnInit {
  form;
  allCabs;
  constructor(
    private dialogRef: MatDialogRef<SelectCabComponent>,
    private commonService: CommonService,
    private socket: SocketService
  ) { }

  ngOnInit() {
    this.socket.initSocket();
    this.form = new FormGroup({
      cabs: new FormControl()
    })
    this.getCabs();
  }

  viewCabs(data) {
    this.dialogRef.close(data.cabs);
  }

  getCabs(param?) {
    this.commonService.getCabs(param).subscribe(
      (res) => {
        this.allCabs = res.sort((a, b) => b.isOnline - a.isOnline);
        this.initialColorSetup(this.allCabs);
        this.updateColorSetup();
      },
      (err) => {

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

  closeModal() {
    this.dialogRef.close();
  }

  initialColorSetup(cabs) {
    cabs.forEach((element, index) => {
      if (element.assigned_current_driver) {
        if (element.assigned_current_driver.address && element.assigned_current_driver.address.location && element.assigned_current_driver.address.location) {
          let date = new Date();
          this.checkUpdate(cabs[index], element.assigned_current_driver.address.location, date);
        }
        else {
          element.isOnline = false;
        }
      }
      else {
        element.isOnline = false;
      }
    });
  }

  updateColorSetup() {
    this.socket.onEvent('allLocation').subscribe(res => {
      if (res) {
        this.allCabs.forEach((element, index) => {
          if (element.assigned_current_driver && element.assigned_current_driver._id == res._id) {
            element.location = res;
            let date = new Date();
            this.checkUpdate(this.allCabs[index], res, date);
            // this.allCabUpdate();
            // console.log('if',element);
          }
          else {
            // console.log('else',element);
            let date = new Date();
            if (element.location) {
              this.checkUpdate(this.allCabs[index], element.location, date);
            }
            // this.allCabUpdate();
          }
          // console.log(element)
        });
      }
    })
  }

  checkUpdate(cab, res, date) {
    // console.log(cab.name)
    if (res.updatedAt) {
      let update = new Date(res.updatedAt);
      if ((date.getFullYear() == update.getFullYear()) && (date.getDay() == update.getDay()) && (date.getMonth() == update.getMonth())) {
        // console.log(moment.duration(moment.utc(date).diff(moment.utc(update)))['_data']['minutes'])
        if (moment.duration(moment.utc(date).diff(moment.utc(update)))['_data']['minutes'] > 0) {
          cab.isOnline = false;
        }
        else {
          cab.isOnline = true;
        }
      }
      else {
        cab.isOnline = false;
      }
    }
    else {
      cab.isOnline = false;
    }
    this.allCabs = this.allCabs.sort((a, b) => b.isOnline - a.isOnline)
  }


}
