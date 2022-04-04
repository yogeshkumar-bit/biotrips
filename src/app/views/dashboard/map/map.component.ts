import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/core/services/common/common.service';
import { SocketService } from 'src/app/core/services/socket/socket.service';
import { Store } from '@ngrx/store';
import { MAP_MESSAGE, IS_ALL, IS_SELECTED, INDEX } from 'src/app/core/store/actions/appActions';
import { distinctUntilChanged } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import * as moment from 'moment';

declare var google: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  noLocation;
  errorMsg;
  allCabs;
  cabId;
  markers = [];
  singleCab;
  isAllCab;
  updatedAt;
  infowindow = new google.maps.InfoWindow();
  private subscription:Subscription
  constructor(
    private route: ActivatedRoute,
    private common: CommonService,
    private socket: SocketService,
    private store: Store<any>
  ) {

  }

  ngOnInit() {
    this.initMap();
    this.subscription=  this.common.reduxData()
    .pipe(distinctUntilChanged())
    .subscribe(res => {
      console.log(res);
      if (res && res['cab']) {
        if ((!this.singleCab || res['cab']['_id'] != this.singleCab._id)) {
          this.deleteMarkers();
          this.isAllCab = false;
          this.singleCab = res['cab'];
          if (this.singleCab.assigned_current_driver) {
            // console.log(this.singleCab)
            this.updatedAt = '';
            this.errorMsg = '';
            this.startInitial(this.singleCab);
            // this.socket.initSocket();
            // this.errorMsg = '';
            // this.updatedAt='';  
          }
          else {
            this.errorMsg = 'Driver is not assigned yet';
            this.updatedAt = '';
            this.socket.end();
          }
        }
      }


      // if (res['isAll']) {
      //   this.allCabSetup();
      //   this.getAllCabsData();
      //   this.store.dispatch({
      //     type: IS_ALL,
      //     payload: false
      //   });

      // }
      // if (res['allCabData'].length > 0) {
      //   this.displayAllCab(res['allCabData'],'update');
      // }

      // if (res['isSelected']) {
      //   this.store.dispatch({
      //     type: IS_SELECTED,
      //     payload: false
      //   });
      // }

      // if (res['selectedCab'].length > 0) {
      //   this.isAllCab = true;
      //   this.displayAllCab(res['selectedCab'],'initial');
      //   this.emitSelected(res['selectedCab']);
      // }


    })



  }


  initMap() {
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      zoom: 15,
      disableDefaultUI: true,
      scaleControl: true,
      zoomControl: true,
      center: { lat: 28.6403084, lng: 77.3382219 }
    });
  }


  startInitial(cab) {
    // console.log('start initial', cab)
    this.common.singleDriver(cab.assigned_current_driver._id).subscribe(res => {
      // console.log(res, 'res')
      if (res['data'].address && res['data'].address.location && res['data'].address.location.length != 0) {
        let location = res['data'].address.location;
        // console.log('location',location,new Date(location.updatedAt),cab.cab_number);
        let updatelocation = new google.maps.LatLng(location.lat, location.long);
        this.setMarker(updatelocation,cab);
        this.errorMsg = '';
        this.updatedAt = location.updatedAt;
      }
      else {
        console.log('elese')
        this.deleteMarkers();
        this.errorMsg = 'No location specified';
        this.updatedAt = '';
      }
      this.initSocket(cab);
    })

  }

  initSocket(cab) {
    this.sendIdtoSocket(cab.assigned_current_driver._id);
  }

  sendIdtoSocket(id) {
    // console.log(id, 'id h');
    this.socket.emitEvent('particularDriver', { drivers: [id] });
    this.getData(id);
  }

  getData(driverId) {
    this.socket.onEvent('location').subscribe(res => {
      // console.log('ye res', res);
      this.updatedAt = res['updatedAt'];
      let updatelocation = new google.maps.LatLng(res.lat, res.long);
      this.setMarker(updatelocation,this.singleCab);
    })
  }


  setMarker(updatelocation, cab) {
    let marker = this.markers.findIndex((element) => {
      return element.id == cab.assigned_current_driver._id;
    });
   if (marker == -1) {
    this.infowindow.close();
      this.deleteMarkers();
      let image = '../../assets/marker.png';
      this.addCabMarker(updatelocation, image, cab);
      this.setMapOnAll(this.map);
    }
    else {
      // console.log('yes');
      this.markers[marker].marker.setPosition(updatelocation);
      this.map.setCenter(updatelocation);
      this.map.panTo(updatelocation);
    }
  }


  // addMarker(location, image, cab, val?) {
  //   var infowindow = new google.maps.InfoWindow();
  //   let marker = new google.maps.Marker({
  //     position: location,
  //     map: this.map,
  //     icon: image
  //   }
  //   );
  //   if (this.map) {
  //     if (val == 'all') {

  //     }
  //     else {
  //       this.map.setCenter(location);
  //       this.map.panTo(location);
  //     }
  //   }
  //   this.markers.push({ marker: marker, id: cab.assigned_current_driver ? cab.assigned_current_driver._id : '' });
  //   google.maps.event.addListener(marker, 'click', (data) => {
  //     infowindow.setContent(cab.assigned_current_driver.name + ' (' + cab.assigned_current_driver.phone + ')' + ' for cab' + ' ' + cab.cab_number);
  //     infowindow.open(this.map, marker);
  //   });
  //   infowindow.setContent(cab.assigned_current_driver.name + ' (' + cab.assigned_current_driver.phone + ')' + ' for cab' + ' ' + cab.cab_number);
  //   infowindow.open(this.map, marker);
  // }

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


  addCabMarker(location, image, data) {
    // console.log('add marker',location.lat())
   // this.infowindow = new google.maps.InfoWindow();
    // console.log(location, image)
    let marker = new google.maps.Marker({
      position: location,
      map: this.map,
      icon: image
    }
    );

    this.map.setCenter(location);
    this.map.panTo(location);
    this.markers.push({ marker: marker, id: data.assigned_current_driver ? data.assigned_current_driver._id : '' });
    this.getAddress(data.assigned_current_driver.address.location,marker,this.infowindow,data);
    // console.log(this.markers, 'marker');
   
  }

  getAddress(location,marker,infowindow,cabData){
    this.common.getAddress(location).subscribe(res =>{
      // console.log(res);
     let address = res['data'].results?res['data'].results[0].formatted_address:'';
     console.log(address);
     this.showInfoWindow(marker,infowindow,cabData,address);
    },(err) =>{
      this.showInfoWindow(marker,infowindow,cabData,'');
    })
  }

  showInfoWindow(marker,infowindow,cabData,address){
    google.maps.event.addListener(marker, 'click', (data) => {
      // console.log(data);
      // console.log(data)
      infowindow.setContent("<div><b style='color:#e3165b'>Vehicle Name </b>: " + cabData.name +  "</div><div><b style='color:#e3165b'>Vehicle No. </b>: " + cabData.cab_number + "</div><div><b style='color:#e3165b'>Driver Name</b>: " + cabData.assigned_current_driver.name + "</div><div><b style='color:#e3165b'>Driver phone no. : </b>" + cabData.assigned_current_driver.phone + "</div><div><b style='color:#e3165b'>Location : </b>" + address +"</div><div><b style='color:#e3165b'>Geo Coordinates : </b>" + cabData.assigned_current_driver.address.location.lat + ", " + cabData.assigned_current_driver.address.location.long + "</div>");
      infowindow.open(this.map, marker);
    });
    infowindow.setContent("<div><b style='color:#e3165b'>Vehicle Name </b>: " + cabData.name +  "</div><div><b style='color:#e3165b'>Vehicle No. </b>: " + cabData.cab_number + "</div><div><b style='color:#e3165b'>Driver Name</b>: " + cabData.assigned_current_driver.name + "</div><div><b style='color:#e3165b'>Driver phone no. : </b>" + cabData.assigned_current_driver.phone + "</div><div><b style='color:#e3165b'>Location : </b>" + address +"</div><div><b style='color:#e3165b'>Geo Coordinates : </b>" + cabData.assigned_current_driver.address.location.lat + ", " + cabData.assigned_current_driver.address.location.long + "</div>");
    infowindow.open(this.map, marker);
    
  }


  // allCabSetup() {
  //   this.isAllCab = true;
  //   this.getCabs();
  // }

  // getAllCabsData(){
  //   this.socket.onEvent('allLocation').subscribe(res => {
  //     this.allCabs.forEach((element, index) => {
  //       if (element.assigned_current_driver && element.assigned_current_driver._id == res._id) {
  //         let updatelocation = new google.maps.LatLng(res.lat, res.long);
  //           this.setMarker(updatelocation, element);
  //       }
  //     });
  //   })
  // }

  // displayAllCab(cabs,val) {
  //   this.deleteMarkers();
  //   cabs.forEach(element => {
  //     if (element.assigned_current_driver) {
  //       if (element.assigned_current_driver.address.location.length > 0) {
  //         if(val == 'initial'){
  //           let updatelocation = new google.maps.LatLng(element.assigned_current_driver.address.location[0].lat, element.assigned_current_driver.address.location[0].long);
  //           this.setMarker(updatelocation, element);
  //         }
  //         else{
  //           console.log(element.location)
  //           let updatelocation = new google.maps.LatLng(element.location.lat, element.location.long);
  //           this.setMarker(updatelocation, element);
  //         }
  //       }
  //     }
  //   });
  // }

  // getCabs() {
  //   this.common.getCabs().subscribe(res => {
  //     this.allCabs = res;
  //     this.displayAllCab(this.allCabs,'initial');
  //   },
  //     (err) => {

  //     }
  //   )
  // }

  // emitSelected(cabs) {
  //   let selectedCab = cabs.filter(element => {
  //     return element.assigned_current_driver
  //   })
  //   let driver = selectedCab.map(item => {
  //     return item._id
  //   })
  //   console.log(driver);
  //   this.socket.emitEvent('perticularDriver', { drivers: driver });
  //   this.getSelectedData(selectedCab);
  // }

  // getSelectedData(cabs) {
  //   this.socket.onEvent('location').subscribe(res => {
  //     let index = cabs.findIndex(element => {
  //       return element.assigned_current_driver._id == res._id;
  //     })
  //     let updatelocation = new google.maps.LatLng(res.lat, res.long);
  //     this.setMarker(updatelocation, cabs[index]);
  //   })
  // }



  ngOnDestroy(){
    console.log('map-leave')
    this.subscription.unsubscribe();
  }



}
