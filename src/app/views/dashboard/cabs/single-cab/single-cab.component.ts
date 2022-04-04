import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common/common.service';
import { MatDialog } from '@angular/material';
import { EditCabComponent } from '../edit-cab/edit-cab.component';
import { DeleteCabComponent } from '../delete-cab/delete-cab.component';
import { AssignDriverComponent } from '../assign-driver/assign-driver.component';
import { DocEditComponent } from '../doc-edit/doc-edit.component';
import { ImageViewerComponent } from '../image-viewer/image-viewer.component';
import { VerifyComponent } from '../verify/verify.component';
import { CreatePaymentComponent } from '../../payments/create-payment/create-payment.component';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { EditPaymentComponent } from '../../payments/edit-payment/edit-payment.component';
import { DeletePaymentComponent } from '../../payments/delete-payment/delete-payment.component';

interface Window {
  webkitURL?: any;
  URL: any;
}

declare var window: Window;


@Component({
  selector: 'app-single-cab',
  templateUrl: './single-cab.component.html',
  styleUrls: ['./single-cab.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class SingleCabComponent implements OnInit {
  displayedColumns: string[] = ['trips', 'earning', 'deduction', 'netAmount', 'tds','month','year', 'total','delete'];
  group = JSON.parse(localStorage.getItem('group'));
  singleCab;
  cabId;
  imagesForPreview;
  constructor(
    private route: ActivatedRoute,
    private common: CommonService,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.route.params.subscribe(res => {
      this.cabId = res['id'];
    })
  }

  ngOnInit() {
    this.getCab();
  }

  imageDownload(url, fileName) {
    // var xhr = new XMLHttpRequest();
    // xhr.open("GET", url, true);
    // xhr.responseType = "blob";
    // xhr.onload = function () {
    //   var urlCreator = window.URL || window.webkitURL;
    //   var imageUrl = urlCreator.createObjectURL(this.response);
    //   var tag = document.createElement('a');
    //   tag.href = imageUrl;
    //   tag.download = fileName;
    //   document.body.appendChild(tag);
    //   tag.click();
    //   document.body.removeChild(tag);
    // }
    // xhr.send();
    // console.log(url,fileName)
    url = url.split('/');
    this.common.downloadImage(url[url.length-1]);
  }

  getCab() {
    this.common.singleCab(this.cabId).subscribe(res => {
      this.singleCab = res['data'];
      console.log(this.singleCab)
    },
      (err => {

      }))
  }

  editCab(data) {
    console.log(data)
    let dialogRef = this.dialog.open(EditCabComponent, {
      height: '100%',
      width: '350px',
      position: {
        right: '0'
      },
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        this.getCab();
      }
    });
  }

  deleteCab(data) {
    let dialogRef = this.dialog.open(DeleteCabComponent, {
      // height: '100%',
      width: '350px',
      position: {
        top: '0'
      },
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.getCab();
        this.router.navigate(['/cabs'])
      }
    });
  }


  assignDriver(data, val) {
    data.for = val;
    let dialogRef = this.dialog.open(AssignDriverComponent, {
      height: '100%',
      width: '350px',
      position: {
        right: '0'
      },
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getCab();
      }
    });
  }

  docEdit(val, data) {
    let dialogRef = this.dialog.open(DocEditComponent, {
      height: '100%',
      width: '350px',
      position: {
        right: '0'
      },
      data: {
        val: val,
        data: data
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getCab();
    });
  }
  imagesArray(view){
    this.imagesForPreview = [
      view == "all" || view == 'rc' ? this.singleCab ? this.singleCab.cab_rc ? this.singleCab.cab_rc.image : null : null : null,
      view == "all" || view == 'insurance' ? this.singleCab ? this.singleCab.cab_insurance ? this.singleCab.cab_insurance.image : null : null : null,
      view == "all" || view == 'pollution' ? this.singleCab ? this.singleCab.cab_pollution_crt ? this.singleCab.cab_pollution_crt.image : null : null : null,
      view == "all" || view == 'fitness' ? this.singleCab ? this.singleCab.fitness ? this.singleCab.fitness.image : null : null : null,
      view == "all" || view == 'permit' ? this.singleCab ? this.singleCab.permit ? this.singleCab.permit.image : null : null : null,
      view == "all" || view == 'tax' ? this.singleCab ? this.singleCab.tax ? this.singleCab.tax.image : null : null : null
    ];
  }

  documentPreview(view) {
    // this.imagesForPreview = [
    //   view == "all" || view == 'rc' ? this.singleCab ? this.singleCab.cab_rc ? this.singleCab.cab_rc.image : null : null : null,
    //   view == "all" || view == 'insurance' ? this.singleCab ? this.singleCab.cab_insurance ? this.singleCab.cab_insurance.image : null : null : null,
    //   view == "all" || view == 'pollution' ? this.singleCab ? this.singleCab.cab_pollution_crt ? this.singleCab.cab_pollution_crt.image : null : null : null,
    //   view == "all" || view == 'fitness' ? this.singleCab ? this.singleCab.fitness ? this.singleCab.fitness.image : null : null : null,
    //   view == "all" || view == 'permit' ? this.singleCab ? this.singleCab.permit ? this.singleCab.permit.image : null : null : null,
    //   view == "all" || view == 'tax' ? this.singleCab ? this.singleCab.tax ? this.singleCab.tax.image : null : null : null
    // ];
    this.imagesArray(view);
    this.imagesForPreview = this.imagesForPreview.filter(element => {
      return element != null;
    })
    let dialogRef = this.dialog.open(ImageViewerComponent, {
      height: '100%',
      minHeight: '600px',
      minWidth: '800px',
      data: this.imagesForPreview
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  singleVendor(vendor) {
    this.router.navigate(['/vendors', vendor._id])
  }

  singleCompany(company) {
    this.router.navigate(['/companies', company._id])
  }

  singleDriver(driver) {
    this.router.navigate(['/drivers', driver._id])
  }
  downloadAll(view){
    this.imagesArray(view);
    this.imagesForPreview.forEach(res=>{
      if(res!=null)
      {
        this.imageDownload(res,'doc')
      }
    })
    console.log(this.imagesForPreview)
  } 

  verifyDoc(key,val){
    let dialogRef = this.dialog.open(VerifyComponent, {
      // height: '100%',
      width: '350px',
      position: {
        top: '0'
      },
      data: {
        key:key,
        val:val,
        cab:this.cabId
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getCab();
      }
    });
  }

  addPayment(data){
    let dialogRef = this.dialog.open(CreatePaymentComponent, {
      height: '100%',
      width: '350px',
      position: {
        right: '0'
      },
      data:data
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.getCab();
      }      
    });
  }

  editPayment(data){
    let dialogRef = this.dialog.open(EditPaymentComponent, {
      height: '100%',
      width: '350px',
      position: {
        right: '0'
      },
      data:{
        data:data,
      cab:this.singleCab
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.getCab();
      }      
    });
  }

  deletePayment(data){
    let dialogRef = this.dialog.open(DeletePaymentComponent, {
      // height: '100%',
      width: '350px',
      position: {
        top: '0'
      },
      data:data
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.getCab();
      }      
    });
  }

}
