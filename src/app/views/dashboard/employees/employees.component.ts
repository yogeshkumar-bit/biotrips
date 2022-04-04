import { Component, OnInit, ViewChild } from "@angular/core";
import { DeleteEmployeeComponent } from "./delete-employee/delete-employee.component";
import { EditEmployeeComponent } from "./edit-employee/edit-employee.component";
import { CreateEmployeeComponent } from "./create-employee/create-employee.component";
import { CommonService } from "src/app/core/services/common/common.service";
import { MatDialog, MatPaginator } from "@angular/material";
import { Router } from "@angular/router";
import { pickBy, identity } from 'lodash';
import { LoaderService } from 'src/app/core/utils/loader/loader.service';

@Component({
  selector: "app-employees",
  templateUrl: "./employees.component.html",
  styleUrls: ["./employees.component.scss"]
})
export class EmployeesComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ["id","name", "email", "phone", "company", "action"];
  public viewTable: boolean = true;
  allEmployees;
  company;
  allCompanies;
  PresentPage = { page: '0', limit: 20 };
  searchData;
  group;
  constructor(
    private common: CommonService,
    private dialog: MatDialog,
    private router: Router,
    private loader: LoaderService,
  ) { 
    this.group = this.common.group();
  }

  ngOnInit() {
    this.getEmployees(this.PresentPage);
    this.getCompanies();
  }

  getEmployees(params?) {
    this.common.startLoading();
    this.common.getEmployees(pickBy(params, identity)).subscribe(
      res => {
        this.allEmployees = res["data"];
        this.common.stopLoading();

      },
      err => {
        this.common.stopLoading();
      }
    );
  }

  addEmployee() {
    let dialogRef = this.dialog.open(CreateEmployeeComponent, {
      height: "100%",
      width: "350px",
      position: {
        right: "0"
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getEmployees({ ...this.PresentPage, ...{ search: this.searchData,company:this.company } });
      }
    });
  }

  editEmployee(data) {
    let dialogRef = this.dialog.open(EditEmployeeComponent, {
      height: "100%",
      width: "350px",
      position: {
        right: "0"
      },
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getEmployees({ ...this.PresentPage, ...{ search: this.searchData,company:this.company } });
      }
    });
  }

  deleteEmployee(data) {
    let dialogRef = this.dialog.open(DeleteEmployeeComponent, {
      // height: '100%',
      width: "350px",
      position: {
        top: "0"
      },
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getEmployees({ ...this.PresentPage, ...{ search: this.searchData,company:this.company } });
      }
    });
  }

  singleEmployee(employee) {
    this.router.navigate(["/employees", employee._id]);
  }

  search(event) {
    this.searchData = event.target.value;
    if (event.target.value.length > 2) {
      this.PresentPage = {
        page: '0',
        limit: 20
      }
      this.paginator.pageIndex = 0;
      this.getEmployees({ ...{ search: event.target.value,company:this.company }, ...this.PresentPage });
    }
    else if (event.target.value.length == 0) {
      this.getEmployees({...this.PresentPage,...{company:this.company}});
    }
  }
  card() {
    this.viewTable = false;
  }
  table() {
    this.viewTable = true;
  }
  next(pageno) {
    this.PresentPage = { page: String(pageno.pageIndex), limit: pageno.pageSize };
    this.getEmployees({ ...this.PresentPage, ...{ search: this.searchData,company:this.company } });
  }

  getCompanies(){
    this.common.getCompanies('').subscribe(
      (res) =>{
        console.log(res);
        this.allCompanies =res['data'];
      },
      (err) =>{
        console.log(err)
      }
    )
  }

  companyFilter(event){
    this.getEmployees({ ...this.PresentPage, ...{ search: this.searchData,company:event.value } });
  }

  clearSelection(){
    this.company=null;
    this.getEmployees({ ...this.PresentPage, ...{ search: this.searchData } });
  }
}
