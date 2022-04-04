import { Component, DoCheck, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { LoaderService } from './core/utils/loader/loader.service';
import * as firebase from 'firebase';
import { environment } from 'src/environments/environment';
import { CommonService } from 'src/app/core/services/common/common.service';
import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  loading =false;
  loadingTab=false;
  loadingSubscription:Subscription;
  constructor(private loader: LoaderService,
    private common:CommonService) {
    // this.loading = this.loader.loader;
   firebase.initializeApp(environment.firebaseConfig);
  }

  ngDoCheck() {
    this.loading = this.loader.loader;
    //  console.log(this.loading);
  }
  // ngOnChanges(changes: SimpleChanges) { 
  //   // changes.prop contains the old and the new value...
  //   this.loading = this.loader.loader;
  //    console.log(this.loading);
  // }

  ngOnInit(){
    this.loadingSubscription = this.common.loadingStatus
    .pipe(
      debounceTime(50)
    )
    .subscribe(res => {
      // console.log(res)
      this.loadingTab = res;
    })
  }

  ngOnDestroy(){
    this.loadingSubscription.unsubscribe();
  }




}
