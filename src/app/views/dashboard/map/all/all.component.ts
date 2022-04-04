import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/core/services/common/common.service';
import { SocketService } from 'src/app/core/services/socket/socket.service';
import { Store } from '@ngrx/store';
import { MAP_MESSAGE, IS_ALL, IS_SELECTED, INDEX } from 'src/app/core/store/actions/appActions';
import { LoaderService } from 'src/app/core/utils/loader/loader.service';
import { distinctUntilChanged } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import * as moment from 'moment';

declare var google: any;

@Component({
  selector: 'app-all',
  templateUrl: './all.component.html',
  styleUrls: ['./all.component.scss']
})
export class AllComponent implements OnInit {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  markers = [];
  allCabs;
  isAllCab;
  url;
  private subscription:Subscription;
  constructor(
    private loader: LoaderService,
    private route: ActivatedRoute,
    private common: CommonService,
    private socket: SocketService,
    private store: Store<any>
  ) {
    this.route.url.subscribe(res => {
      this.url = res[0].path;
      if (res[0].path == 'all') {
        this.deleteMarkers();
        this.allCabSetup();
        this.getAllCabsData();
      }
      else {
        this.deleteMarkers();
      }
    })
  }

  ngOnInit() {
    this.initMap();
   this.subscription =  this.common.reduxData()
    .pipe(distinctUntilChanged())
    .subscribe(res => {
      console.log(res)

      // if (res['isSelected']) {
      //   this.store.dispatch({
      //     type: IS_SELECTED,
      //     payload: false
      //   });
      // }

      if(res){
        if ( res['selectedCab'] && res['selectedCab'].length > 0) {
        this.displayAllCab(res['selectedCab'], 'initial');
        console.log(res['selectedCab'],'cab')
        this.emitSelected(res['selectedCab']);
      }
      }
    })

    // this.store.dispatch({
    //   type: INDEX,
    //   payload: { index: 'no' }
    // });

  }


  initMap() {
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      zoom: 10,
      disableDefaultUI: true,
      scaleControl: true,
      zoomControl: true,
      center: { lat: 28.6403084, lng: 77.3382219 }
    });
  }



  setMarker(updatelocation, cab,image) {

    let marker = this.markers.findIndex((element) => {
      return element.id == cab.assigned_current_driver._id
    });
    if (marker == -1) {
      // let image = '../../assets/marker.png';
      this.addMarker(updatelocation, image, cab);
      this.setMapOnAll(this.map);
    }
    else {
      this.markers[marker].marker.setPosition(updatelocation);
    }
  }


  addMarker(location, image, cab, val?) {
    // console.log('add marker',location.lat())
    var infowindow = new google.maps.InfoWindow();
    // console.log(location, image)
    let marker = new google.maps.Marker({
      position: location,
      map: this.map,
      icon: image
    }
    );
    if (this.map) {
      if (val == 'all') {

      }
      else {
        // this.map.setCenter(location);
        // this.map.panTo(location);
      }
    }
    this.markers.push({ marker: marker, id: cab.assigned_current_driver._id });
    // console.log(this.markers, 'marker');
    google.maps.event.addListener(marker, 'click', (data) => {
      infowindow.setContent(cab.cab_number);
      infowindow.open(this.map, marker);
    });
    infowindow.setContent(cab.cab_number);
    infowindow.open(this.map, marker);
  }

  setMapOnAll(map) {
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].marker.setMap(map);
    }
  }

  clearMarkers() {
    this.setMapOnAll(null);
  }

  deleteMarkers() {
    this.clearMarkers();
    this.markers = [];
  }


  allCabSetup() {
    this.getCabs();
  }

  getAllCabsData() {
    this.socket.onEvent('allLocation').subscribe(res => {
      if (res) {
        // console.log(res);
        if(this.allCabs && this.allCabs.length>0){
          this.allCabs.forEach((element, index) => {
            if (element.assigned_current_driver && element.assigned_current_driver._id == res._id) {
              let updatelocation = new google.maps.LatLng(res.lat, res.long);
              // this.setMarker(updatelocation, element);
              this.checkUpdate(element,res,updatelocation);
            }
          });
        }
      }
    })
  }

  displayAllCab(cabs, val) {
    this.deleteMarkers();
    cabs.forEach(element => {
      if (element.assigned_current_driver) {
        if (element.assigned_current_driver.address && element.assigned_current_driver.address.location) {
          if (val == 'initial') {
            let updatelocation = new google.maps.LatLng(element.assigned_current_driver.address.location.lat, element.assigned_current_driver.address.location.long);
            // this.setMarker(updatelocation, element);
            this.checkUpdate(element,element.assigned_current_driver.address.location,updatelocation);
          }
          else {
            console.log(element.location)
            let updatelocation = new google.maps.LatLng(element.location.lat, element.location.long);
            // this.setMarker(updatelocation, element);
            this.checkUpdate(element,element.assigned_current_driver.address.location,updatelocation);
          }
        }
      }
    });
  }

  getCabs() {
    this.common.startLoading();
    this.common.getCabs().subscribe(res => {
      this.allCabs = res;
      this.displayAllCab(this.allCabs, 'initial');
      this.common.stopLoading();
    },
      (err) => {
        this.common.stopLoading();
      }
    )
  }

  emitSelected(cabs) {
    let selectedCab = cabs.filter(element => {
      return element.assigned_current_driver
    })
    let driver = selectedCab.map(item => {
      return item._id
    })
    // console.log(cabs);
    this.socket.emitEvent('particularDriver', { drivers: driver });
    this.getSelectedData(selectedCab);
  }

  getSelectedData(cabs) {
    this.socket.onEvent('location').subscribe(res => {
      let index = cabs.findIndex(element => {
        return element.assigned_current_driver._id == res._id;
      })
      let updatelocation = new google.maps.LatLng(res.lat, res.long);
      // this.setMarker(updatelocation, cabs[index]);
      this.checkUpdate(cabs[index],res,updatelocation);
    })
  }

  ngOnDestroy(){
    console.log('leave')
    this.subscription.unsubscribe();
  }


  checkUpdate(cab, res,updatelocation) {
    let date = new Date();
    // console.log(cab,new Date(res.updatedAt))
    if (res.updatedAt) {
      let update = new Date(res.updatedAt);
      if ((date.getFullYear() == update.getFullYear()) && (date.getDay() == update.getDay()) && (date.getMonth() == update.getMonth())) {
        // console.log(moment.duration(moment.utc(date).diff(moment.utc(update)))['_data']['minutes'])
        if (moment.duration(moment.utc(date).diff(moment.utc(update)))['_data']['minutes'] > 0) {
          cab.isOnline = false;
          this.setMarker(updatelocation,cab,'../../assets/red.png');
        }
        else {
          cab.isOnline = true;
          this.setMarker(updatelocation,cab,'../../assets/green.png');
        }
      }
      else {
        cab.isOnline = false;
        this.setMarker(updatelocation,cab,'../../assets/red.png');
      }
    }
    else {
      cab.isOnline = false;
      this.setMarker(updatelocation,cab,'../../assets/red.png');
    }

  }

  
}
