import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/core/services/common/common.service';
import { FormBuilder } from '@angular/forms';
import { pickBy, identity } from 'lodash';
import { LoaderService } from 'src/app/core/utils/loader/loader.service';

@Component({
  selector: 'app-view-dashboard',
  templateUrl: './view-dashboard.component.html',
  styleUrls: ['./view-dashboard.component.scss']
})
export class ViewDashboardComponent implements OnInit {
  allData;
  allVendors;
  allCompanies;
  form;
  group;
  constructor(
    private loader: LoaderService,
    private common: CommonService,
    private fb: FormBuilder
  ) {
    this.group = this.common.group();
  }

  ngOnInit() {
    this.dashboardData();
    if (this.group != 2) {
      this.getCompanies();
    }
    if (this.group != 3) {
      this.getVendors();
    }
    this.createForm();
  }

  createForm(): void {
    this.form = this.fb.group({
      company: [''],
      vendor: [''],
    });
  }

  dashboardData(params?) {
    this.common.startLoading();
    this.common.dashboardCount(params).subscribe(res => {
      this.allData = res['data'];
      this.common.stopLoading();
    },(err) =>{
      this.common.stopLoading();
    })
  }

  getVendors() {
    this.common.getVendors('').subscribe(
      (res) => {
        this.allVendors = res['data'];
      },
      (err) => {
      }
    )
  }
  getCompanies() {
    this.common.getCompanies('').subscribe(
      (res) => {
        this.allCompanies = res['data'];
        console.log(this.allCompanies);
      },
      (err) => {
      }
    )
  }

  filter(data) {
    this.dashboardData(pickBy(data, identity));
  }

  clear() {
    this.form.reset();
    this.dashboardData();
  }

}
