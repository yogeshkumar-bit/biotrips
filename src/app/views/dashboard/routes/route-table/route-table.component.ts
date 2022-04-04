import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonService } from 'src/app/core/services/common/common.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-route-table',
  templateUrl: './route-table.component.html',
  styleUrls: ['./route-table.component.scss']
})
export class RouteTableComponent implements OnInit {
  displayedColumns: string[] = ["name", "company", "vendor", "cab", "employee", "action"];
  @Input() viewTable;
  @Input() allRoutes;
  @Output() editRoute = new EventEmitter();
  @Output() deleteRoute = new EventEmitter();
  @Output() singleRoute = new EventEmitter();
  @Output() removeEmp = new EventEmitter();
  @Output() addEmp = new EventEmitter();
  @Output() assignRouteVendor = new EventEmitter();
  @Output() assignRouteCab = new EventEmitter();
  group;
  @Input() status;
  @Input() page;
  allCabs = [{ name: '' }];
  allVendors = [{ name: '' }];
  form;
  loader;
  constructor(
    private common: CommonService,
    private fb: FormBuilder
  ) {
    this.group = this.common.group();
  }

  ngOnInit() {
    // this.getCabs();
    // this.getVendors();
  }

  getCabs(params?) {
    this.allCabs = [{ name: '' }];
    this.loader = true;
    this.common.getCabs(params).subscribe(res => {
      this.allCabs = res;
      if (this.allCabs.length == 0) {
        this.allCabs = [{ name: 'There is no cabs' }];
      }
      this.loader = false;
    },
      (err) => {
        this.loader = false;

      }
    )
  }


  getVendors(params?) {
    this.allVendors = [{ name: '' }]
    this.loader = true;
    this.common.getVendors(params).subscribe(res => {
      this.allVendors = res['data'];
      if (this.allVendors.length == 0) {
        this.allVendors = [{ name: 'There is no vendors' }];
      }
      this.loader = false;
    },
      (err) => {
        this.loader = false;
      }
    )
  }



  editRouteEvent(data) {
    this.editRoute.emit(data);
  }

  deleteRouteEvent(data) {
    this.deleteRoute.emit(data);
  }

  singleRouteEvent(data) {
    this.singleRoute.emit(data);
  }

  removeEmployee(route, employee) {
    this.removeEmp.emit({ route: route, employee: employee })
  }

  addEmployee(data) {
    this.addEmp.emit(data);
  }

  assignVendor(event, route) {
    let data = {
      route: route._id,
      vendor: event.value
    }
    this.assignRouteVendor.emit(data);
  }

  assignCab(event, route) {
    let data = {
      route: route._id,
      cab: event.value
    }
    this.assignRouteCab.emit(data);
  }
}
