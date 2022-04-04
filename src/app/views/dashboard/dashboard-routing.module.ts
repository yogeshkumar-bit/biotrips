import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { MapComponent } from './map/map.component';
import { CreateDriverComponent } from './drivers/create-driver/create-driver.component';
import { AllComponent } from './map/all/all.component';
import { VendorsComponent } from './vendors/vendors.component';
import { CompaniesComponent } from './companies/companies.component';
import { DriversComponent } from './drivers/drivers.component';
import { CabsComponent } from './cabs/cabs.component';
import { SingleVendorComponent } from './vendors/single-vendor/single-vendor.component';
import { SingleCompanyComponent } from './companies/single-company/single-company.component';
import { SingleDriverComponent } from './drivers/single-driver/single-driver.component';
import { SingleCabComponent } from './cabs/single-cab/single-cab.component';
import { EmployeesComponent } from './employees/employees.component';
import { SingleEmployeeComponent } from './employees/single-employee/single-employee.component';
import { RoutesComponent } from './routes/routes.component';
import { SingleRouteComponent } from './routes/single-route/single-route.component';
import { TripsComponent } from './trips/trips.component';
import { HistoryComponent } from './trips/history/history.component';
import { ShiftsComponent } from './shifts/shifts.component';
import { SingleShiftComponent } from './shifts/single-shift/single-shift.component';
import { ViewDashboardComponent } from './view-dashboard/view-dashboard.component';
import { MapTripComponent } from './trips/map-trip/map-trip.component';
import { ReportsComponent } from './reports/reports.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '', component: ViewDashboardComponent,
       
      },
      {
        path: 'track',
        component: HomeComponent,
        children:[
          {
            path: '', component: MapComponent
          },
          {
            path: 'all', component: AllComponent
          },
          {
            path: 'selected', component: AllComponent
          },
        ]
      },
      {
        path: 'vendors',
        component: VendorsComponent
      },
      {
        path: 'vendors/:id',
        component: SingleVendorComponent
      },
      {
        path: 'companies',
        component: CompaniesComponent
      },
      {
        path: 'companies/:id',
        component: SingleCompanyComponent
      },
      {
        path: 'drivers',
        component: DriversComponent
      },
      {
        path: 'drivers/:id',
        component: SingleDriverComponent
      },
      {
        path: 'cabs',
        component: CabsComponent
      },
      {
        path: 'cabs/:id',
        component: SingleCabComponent
      },
      {
        path: 'employees',
        component: EmployeesComponent
      },
      {
        path: 'employees/:id',
        component: SingleEmployeeComponent
      },
      {
        path: 'routes',
        component: RoutesComponent
      },
      {
        path: 'routes/:id',
        component: SingleRouteComponent
      },
      {
        path: 'trips',
        component: TripsComponent
      },
      {
        path: 'trips/:id',
        component: HistoryComponent
      },
      // {
      //   path: 'shifts',
      //   component: ShiftsComponent
      // },
      {
        path: 'shifts/:id',
        component: SingleShiftComponent
      },
      {
        path: 'reports',
        component: ReportsComponent
      },
     {
      path: 'trips/cab/:cId/path/:id',
      component: MapTripComponent
     }
      ]
      }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
