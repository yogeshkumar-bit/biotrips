import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/core/services/common/common.service';
import { MatDialog, MatPaginator } from '@angular/material';
import { CreateCompanyComponent } from './create-company/create-company.component';
import { DeleteCompanyComponent } from './delete-company/delete-company.component';
import { EditCompanyComponent } from './edit-company/edit-company.component';
import { Router } from '@angular/router';
import { pickBy, identity } from 'lodash';
import { LoaderService } from 'src/app/core/utils/loader/loader.service';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss']
})
export class CompaniesComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = [
    "name",
    "email",
    "phone",
    "owner",
    "vendor",
    "action"
  ];
  group;
  searchData;
  public viewTable: boolean = true;
  allCompanies;
  PresentPage = { page: '0', limit: 20 };
  constructor(
    private common: CommonService,
    private dialog: MatDialog,
    private router: Router,
    private loader: LoaderService,
  ) {
    this.group = this.common.group();
  }

  ngOnInit() {
    this.getCompanies(this.PresentPage);
  }


  getCompanies(params?) {
    this.common.startLoading();    
    this.common.getCompanies(pickBy(params, identity)).subscribe(res => {
      this.allCompanies = res['data'];
    this.common.stopLoading();      
    },
      (err) => {
    this.common.stopLoading();
        
      }
    )
  }

  addCompany() {
    let dialogRef = this.dialog.open(CreateCompanyComponent, {
      height: '100%',
      width: '350px',
      position: {
        right: '0'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getCompanies({ ...this.PresentPage, ...{ search: this.searchData } });
      }
    });
  }

  editCompany(data) {
    let dialogRef = this.dialog.open(EditCompanyComponent, {
      height: '100%',
      width: '350px',
      position: {
        right: '0'
      },
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(this.PresentPage)
        this.getCompanies({ ...this.PresentPage, ...{ search: this.searchData } });
      }
    });
  }

  deleteCompany(data) {
    let dialogRef = this.dialog.open(DeleteCompanyComponent, {
      // height: '100%',
      width: '350px',
      position: {
        top: '0'
      },
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getCompanies({ ...this.PresentPage, ...{ search: this.searchData } });
      }
    });
  }

  singleCompany(company) {
    this.router.navigate(['/companies', company._id])
  }

  search(event) {
    this.searchData = event.target.value;

    if (event.target.value.length > 2) {
      this.PresentPage = {
        page: '0',
        limit: 20
      }
      this.paginator.pageIndex = 0;
      this.getCompanies({ ...{ search: event.target.value }, ...this.PresentPage });
    }
    else if (event.target.value.length == 0) {
      this.getCompanies(this.PresentPage);
    }
  }
  table() {
    this.viewTable = true;
  }
  card() {
    this.viewTable = false;
  }
  next(pageno) {
    this.PresentPage = { page: String(pageno.pageIndex), limit: pageno.pageSize }
    this.getCompanies({ ...this.PresentPage, ...{ search: this.searchData } });
  }


}
