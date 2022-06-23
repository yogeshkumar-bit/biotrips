import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../core/module/material/material.module';
import { ImageViewerModule } from 'ngx-image-viewer';


// for high Chart
// import { HighChartModule } from 'highcharts';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { MapComponent } from './map/map.component';
import { SelectCabComponent } from './select-cab/select-cab.component';
import { DriversComponent } from './drivers/drivers.component';
import { CreateDriverComponent } from './drivers/create-driver/create-driver.component';
import { AllComponent } from './map/all/all.component';
import { VendorsComponent } from './vendors/vendors.component';
import { CreateVendorComponent } from './vendors/create-vendor/create-vendor.component';
import { EditVendorComponent } from './vendors/edit-vendor/edit-vendor.component';
import { DeleteVendorComponent } from './vendors/delete-vendor/delete-vendor.component';
import { CompaniesComponent } from './companies/companies.component';
import { CreateCompanyComponent } from './companies/create-company/create-company.component';
import { EditCompanyComponent } from './companies/edit-company/edit-company.component';
import { DeleteCompanyComponent } from './companies/delete-company/delete-company.component';
import { EditDriverComponent } from './drivers/edit-driver/edit-driver.component';
import { DeleteDriverComponent } from './drivers/delete-driver/delete-driver.component';
import { CabsComponent } from './cabs/cabs.component';
import { CreateCabComponent } from './cabs/create-cab/create-cab.component';
import { EditCabComponent } from './cabs/edit-cab/edit-cab.component';
import { DeleteCabComponent } from './cabs/delete-cab/delete-cab.component';
import { SingleVendorComponent } from './vendors/single-vendor/single-vendor.component';
import { SingleCompanyComponent } from './companies/single-company/single-company.component';
import { SingleCabComponent } from './cabs/single-cab/single-cab.component';
import { SingleDriverComponent } from './drivers/single-driver/single-driver.component';
import { AssignDriverComponent } from './cabs/assign-driver/assign-driver.component';
import { DocEditComponent } from './cabs/doc-edit/doc-edit.component';
import { AssignVendorComponent } from './companies/assign-vendor/assign-vendor.component';
import { ExportPreviewComponent } from './cabs/export-preview/export-preview.component';
import { ImageViewerComponent } from './cabs/image-viewer/image-viewer.component';
import { EmployeesComponent } from './employees/employees.component';
import { CreateEmployeeComponent } from './employees/create-employee/create-employee.component';
import { EditEmployeeComponent } from './employees/edit-employee/edit-employee.component';
import { DeleteEmployeeComponent } from './employees/delete-employee/delete-employee.component';
import { RoutesComponent } from './routes/routes.component';
import { SingleEmployeeComponent } from './employees/single-employee/single-employee.component';
import { CreateRouteComponent } from './routes/create-route/create-route.component';
import { EditRouteComponent } from './routes/edit-route/edit-route.component';
import { DeleteRouteComponent } from './routes/delete-route/delete-route.component';
import { AddEmployeeComponent } from './routes/add-employee/add-employee.component';
import { RemoveEmployeeComponent } from './routes/remove-employee/remove-employee.component';
import { AssignCabComponent } from './routes/assign-cab/assign-cab.component';
import { TripsComponent } from './trips/trips.component';
import { HistoryComponent } from './trips/history/history.component';
import { UpcommingComponent } from './trips/upcomming/upcomming.component';
import { SingleRouteComponent } from './routes/single-route/single-route.component';
import { ShiftsComponent } from './shifts/shifts.component';
import { CreateShiftComponent } from './shifts/create-shift/create-shift.component';
import { EditShiftComponent } from './shifts/edit-shift/edit-shift.component';
import { DeleteShiftComponent } from './shifts/delete-shift/delete-shift.component';
import { SingleShiftComponent } from './shifts/single-shift/single-shift.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ViewDashboardComponent } from './view-dashboard/view-dashboard.component';
import { MapTripComponent } from './trips/map-trip/map-trip.component';
import { DateRangePickerModule } from '@syncfusion/ej2-angular-calendars';
import { MatPaginatorModule } from '@angular/material/paginator';
import { AssignVendorRouteComponent } from './routes/assign-vendor-route/assign-vendor-route.component';
import { RouteTableComponent } from './routes/route-table/route-table.component';
import { AlreadyEmployeeComponent } from './routes/already-employee/already-employee.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { PaymentsComponent } from './payments/payments.component';
import { CreatePaymentComponent } from './payments/create-payment/create-payment.component';
import { NotPublishedComponent } from './routes/not-published/not-published.component';
import { HistoryTimelineComponent } from './trips/history-timeline/history-timeline.component';
import { GooglePlacesDirective } from 'src/app/core/directives/google-places.directive';
import { AssignCompanyComponent } from './cabs/assign-company/assign-company.component';
import { RemoveCabComponent } from './companies/remove-cab/remove-cab.component';
import { VerifyComponent } from './cabs/verify/verify.component';
import { BlockComponent } from './drivers/block/block.component';
import { RemoveVendorComponent } from './companies/remove-vendor/remove-vendor.component';
import { BlockedCabModalComponent } from './cabs/blocked-cab-modal/blocked-cab-modal.component';
import { AddZoneComponent } from './companies/add-zone/add-zone.component';
import { ReportsComponent } from './reports/reports.component';
import { TripStatusPipe } from 'src/app/core/utils/pipes/trip-status/trip-status.pipe';
import { EditPaymentComponent } from './payments/edit-payment/edit-payment.component';
import { MoveEmployeeComponent } from './routes/move-employee/move-employee.component';
import { DeletePaymentComponent } from './payments/delete-payment/delete-payment.component';
import { UpdateLogoComponent } from './vendors/update-logo/update-logo.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    ImageViewerModule.forRoot(),

    DashboardRoutingModule,
    DragDropModule,
    DateRangePickerModule,
    MatPaginatorModule,
    Ng2SearchPipeModule
    // HighChartModule
  ],

  declarations: [

    DashboardComponent,
    HomeComponent,
    MapComponent,
    SelectCabComponent,
    DriversComponent,
    CreateDriverComponent,
    AllComponent,
    VendorsComponent,
    CreateVendorComponent,
    EditVendorComponent,
    DeleteVendorComponent,
    CompaniesComponent,
    CreateCompanyComponent,
    EditCompanyComponent,
    DeleteCompanyComponent,
    EditDriverComponent,
    DeleteDriverComponent,
    CabsComponent,
    CreateCabComponent,
    EditCabComponent,
    DeleteCabComponent,
    SingleVendorComponent,
    SingleCompanyComponent,
    SingleCabComponent,
    SingleDriverComponent,
    AssignDriverComponent,
    DocEditComponent,
    AssignVendorComponent,
    ExportPreviewComponent,
    ImageViewerComponent,
    EmployeesComponent,
    CreateEmployeeComponent,
    EditEmployeeComponent,
    DeleteEmployeeComponent,
    RoutesComponent,
    SingleEmployeeComponent,
    CreateRouteComponent,
    EditRouteComponent,
    DeleteRouteComponent,
    AddEmployeeComponent,
    RemoveEmployeeComponent,
    AssignCabComponent,
    TripsComponent,
    HistoryComponent,
    UpcommingComponent,
    SingleRouteComponent,
    ShiftsComponent,
    CreateShiftComponent,
    EditShiftComponent,
    DeleteShiftComponent,
    SingleShiftComponent,
    ViewDashboardComponent,
    MapTripComponent,
    AssignVendorRouteComponent,
    RouteTableComponent,
    AlreadyEmployeeComponent,
    PaymentsComponent,
    CreatePaymentComponent,
    NotPublishedComponent,
    HistoryTimelineComponent,
    GooglePlacesDirective,
    AssignCompanyComponent,
    RemoveCabComponent,
    VerifyComponent,
    BlockComponent,
    RemoveVendorComponent,
    BlockedCabModalComponent,
    AddZoneComponent,
    ReportsComponent,
    TripStatusPipe,
    EditPaymentComponent,
    MoveEmployeeComponent,
    EditPaymentComponent,
    DeletePaymentComponent,
     UpdateLogoComponent

  ],
  entryComponents: [
    SelectCabComponent,
    CreateVendorComponent,
    EditVendorComponent,
    DeleteVendorComponent,
    CreateCompanyComponent,
    CreateCabComponent,
    CreateDriverComponent,
    EditCompanyComponent,
    EditDriverComponent,
    EditCabComponent,
    DeleteCabComponent,
    DeleteCompanyComponent,
    DeleteDriverComponent,
    AssignDriverComponent,
    DocEditComponent,
    AssignVendorComponent,
    ExportPreviewComponent,
    ImageViewerComponent,
    CreateEmployeeComponent,
    CreateRouteComponent,
    EditEmployeeComponent,
    EditRouteComponent,
    DeleteEmployeeComponent,
    DeleteRouteComponent,
    CreateShiftComponent,
    EditShiftComponent,
    DeleteShiftComponent,
    AssignCabComponent,
    AddEmployeeComponent,
    RemoveEmployeeComponent,
    AssignVendorRouteComponent,
    AlreadyEmployeeComponent,
    CreatePaymentComponent,
    NotPublishedComponent,
    HistoryTimelineComponent,
    AssignCompanyComponent,
    RemoveCabComponent,
    VerifyComponent,
    BlockComponent,
    RemoveVendorComponent,
    BlockedCabModalComponent,
    AddZoneComponent,
    EditPaymentComponent,
    MoveEmployeeComponent,
    EditPaymentComponent,
    DeletePaymentComponent,
    UpdateLogoComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class DashboardModule { }
