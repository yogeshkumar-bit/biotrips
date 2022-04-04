import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common/common.service';
import { FormBuilder } from '@angular/forms';
import { pickBy, identity } from 'lodash';
declare var google: any;
import * as moment from 'moment';
import * as lodash from 'lodash';
import { LoaderService } from 'src/app/core/utils/loader/loader.service';

@Component({
  selector: 'app-map-trip',
  templateUrl: './map-trip.component.html',
  styleUrls: ['./map-trip.component.scss']
})
export class MapTripComponent implements OnInit {
  @ViewChild('map') mapElement: ElementRef;
  allPolylines = [];
  map: any;
  cabId;
  tripId;
  cabHistory;
  form;
  allCabs;
  showClose;
  markers = [];
  color = ['red', 'green', '#007bff', 'black', 'gray', 'orange'];
  circle = ['../../../../assets/circle.png', '../../../../assets/circle-g.png', '../../../../assets/circle-b.png', '../../../../assets/circle-bl.png', '../../../../assets/circle-gr.png', '../../../../assets/circle-o.png']

  allTimes = [
    { label: '1:00' }, { label: '1:30' }, { label: '2:00' }, { label: '2:30', }, { label: '3:00' }, { label: '3:30' }, { label: '4:00' }, { label: '4:30' }, { label: '5:00' }, { label: '5:30' }, { label: '6:00' }, { label: '6:30' }, { label: '7:00' }, { label: '7:30' }, { label: '8:00' }, { label: '8:30' }, { label: '9:00' }, { label: '9:30' }, { label: '10:00' }, { label: '10:30' }, { label: '11:00' }, { label: '11:30' }, { label: '12:00' }, { label: '12:30' }, { label: '13:00' }, { label: '13:30' }, { label: '14:00' }, { label: '14:30' }, { label: '15:00' }, { label: '15:30' }, { label: '16:00' }, { label: '16:30' }, { label: '17:00' }, { label: '17:30' }, { label: '18:00' }, { label: '18:30' }, { label: '19:00' }, { label: '19:30' }, { label: '20:00' }, { label: '20:30' }, { label: '21:00' }, { label: '21:30' }, { label: '22:00' }, { label: '22:30' }, { label: '23:00' }, { label: '23:30' }, { label: '24:00' }
  ]
  date = new Date();
  constructor(
    private route: ActivatedRoute,
    private common: CommonService,
    private fb: FormBuilder,
    private loader: LoaderService,
    private router:Router
  ) {
    this.route.params.subscribe(res => {
      this.cabId = res['cId'];
      this.tripId = res['id'] == 'notrip' ? null : res['id'];
      if (!this.tripId) {
        this.date.setHours(0, 0, 0, 0);
      }
      else {
        this.date = null;
      }
      this.getStartHistory(this.cabId, { trip: this.tripId, fromDate: this.date ? moment.utc(this.date) : '' });
    })
  }

  ngOnInit() {
    this.initMap();
    this.createForm();
    this.getCabs();
  }
  getCabs(params?) {
    this.common.startLoading();
    this.common.getCabs(params).subscribe(res => {
      this.allCabs = res;
      this.common.stopLoading();
    },
      (err) => {
        this.common.stopLoading();
      }
    )
  }

  createForm(): void {

    this.form = this.fb.group({
      cab: [this.cabId != 'all' ? this.cabId : ''],
      startDate: [this.date],
      startTime: [''],
      endDate: [''],
      endTime: [''],
    });
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

  // getCabHistory(id, params?) {
  //   this.common.cabLocations(id, params).subscribe(res => {
  //     this.cabHistory = res['data']['trips'];
  //     console.log(this.cabHistory)
  //     if (this.cabHistory.length > 0) {
  //       this.resetMap();
  //       this.showMap();
  //     }
  //     else {
  //       this.resetMap();
  //     }
  //   })
  // }

  getStartHistory(cab, params?) {
    this.common.cabLocations(cab, params).subscribe(res => {
      this.cabHistory = res['data'];
      this.resetMap();
      this.showMapNew();
    })
  }


  // showMap() {
  //   this.cabHistory.forEach((element, index) => {
  //     console.log(element);
  //     let employeeLocation = element.employees.map((employee, employeeIndex) => {
  //       if (employee.address && employee.address.location) {
  //         let updatelocation = new google.maps.LatLng(employee.address.location.lat, employee.address.location.long);

  //         if (element.type == 'drop') {
  //           if (employeeIndex == element.employees.length - 1) {
  //             this.setMarker(updatelocation, employee, '../../../../assets/destination.png');
  //           }
  //           else {
  //             this.setMarker(updatelocation, employee, '../../../../assets/boss.png');
  //           }
  //         }
  //         else {

  //           this.setMarker(updatelocation, employee, '../../../../assets/boss.png');
  //         }
  //         return {
  //           lat: employee.address.location.lat,
  //           lng: employee.address.location.long,
  //         }
  //       }
  //     });

  //     let allLocations = [];
  //     element.locations.forEach((location, locationIndex) => {
  //       if (location) {
  //         if (!location.accuracy || location.accuracy < 800) {
  //           if (locationIndex == 0) {
  //             let startLocation = new google.maps.LatLng(location.lat, location.long);
  //             this.setMarker(startLocation, location.createdAt, '../../../../assets/location-pin.png');
  //           }
  //           else {
  //             let dotLocation = new google.maps.LatLng(location.lat, location.long);
  //             this.setMarker(dotLocation, location.createdAt, {
  //               url: this.circle[index], // url
  //               scaledSize: new google.maps.Size(10, 10), // scaled size
  //               origin: new google.maps.Point(0, 0), // origin
  //               anchor: new google.maps.Point(5, 5)
  //             });
  //           }

  //           allLocations.push({
  //             lat: location.lat,
  //             lng: location.long
  //           })
  //         }
  //       }
  //     });
  //     if (element.company && element.company.address && element.company.address.location) {
  //       let updatelocation = new google.maps.LatLng(element.company.address.location.lat, element.company.address.location.long);
  //       if (element.type == 'drop') {
  //         this.setMarker(updatelocation, element.company, '../../../../assets/location-pin.png');
  //       }
  //       else {
  //         this.setMarker(updatelocation, element.company, '../../../../assets/destination.png');
  //       }
  //     }
  //     let allCordinates = allLocations;
  //     this.drawPolyline(allCordinates, this.color[index]);
  //   });
  // }


  showMapNew() {
    let allLocations = [];
    if (this.tripId) {
      let halt = 0;
      let start;
      let end;
      allLocations = this.cabHistory.locations.map((element, index) => {
       // console.log(element);
        let haltTime;
        if (!element.accuracy || element.accuracy < 800) {

          // arrow marker

          let dotLocation = new google.maps.LatLng(element.lat, element.long);
          let prevLocation;
          let diff;
          if (this.cabHistory.locations[index + 1]) {
            prevLocation = new google.maps.LatLng(this.cabHistory.locations[index + 1].lat, this.cabHistory.locations[index + 1].long);
          }
          if (this.cabHistory.locations[index + 1]) {
            diff = element.lat > this.cabHistory.locations[index + 1].lat ? element.lat - this.cabHistory.locations[index + 1].lat : this.cabHistory.locations[index + 1].lat - element.lat
          }
          // console.log(diff);
          if ((index == 0) || diff ? diff > 0.001 : false) {
            halt += 1;
            if (halt == 1) {
              start = moment(element.createdAt).format("HH:mm a");
            }
            if(halt >= 5){
              end = moment(element.createdAt).format("HH:mm a");
              haltTime = start + ' - ' + end;
              this.setMarker(dotLocation, haltTime, '../../../../assets/halt.png', 'diff');
            }
            halt = 0;
            this.addMarkerArrow(dotLocation, prevLocation,
              {
                path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                scale: 3,
                strokeColor: 'red',
                anchor: new google.maps.Point(0, 4),
              },
              element.createdAt
            );
          }

          else if ((diff ? diff <= 0.001 : false)) {
           
            halt += 1;
            if (halt == 1) {
              start = moment(element.createdAt).format("HH:mm a");
            }
            if (halt >= 5) {
              end = moment(element.createdAt).format("HH:mm a");
                haltTime = start + ' - ' + end;
              // this.setMarker(dotLocation,haltTime, '../../../../assets/halt.png', 'diff');
            }
          }



          // arrow marker

          if (element.employee) {
            // console.log(element)
            let employeelocation = new google.maps.LatLng(element.lat, element.long);
            this.setMarker(employeelocation, element.employee, '../../../../assets/boss.png','emp');
          }
          return {
            lat: element.lat,
            lng: element.long
          }
        }
      });
    // console.log(allLocations);
      let startlocation = new google.maps.LatLng(this.cabHistory.locations[0].lat, this.cabHistory.locations[0].long);
      this.setMarker(startlocation, this.cabHistory.locations[0].createdAt, '../../../../assets/se.png');
      let endlocation = new google.maps.LatLng(this.cabHistory.locations[this.cabHistory.locations.length - 1].lat, this.cabHistory.locations[this.cabHistory.locations.length - 1].long);

      this.setMarker(endlocation, this.cabHistory.locations[this.cabHistory.locations.length - 1].createdAt, '../../../../assets/e.png');
      if (this.cabHistory.locations[0].trip.company && this.cabHistory.locations[0].trip.company.address && this.cabHistory.locations[0].trip.company.address.location) {
        let companylocation = new google.maps.LatLng(this.cabHistory.locations[0].trip.company.address.location.lat, this.cabHistory.locations[0].trip.company.address.location.long);
       this.setMarker(companylocation, this.cabHistory.locations[0].trip.company, '../../../../assets/office.png');
        
      }


      this.drawPolyline((lodash.without(allLocations, undefined)));
    }
    else {
      if(this.cabHistory.assigned_current_driver && this.cabHistory.assigned_current_driver.address && this.cabHistory.assigned_current_driver.address.location){
        this.showCabMarker(this.cabHistory.assigned_current_driver.address.location);
      }
      let tempLocation = [];
      if (this.cabHistory.locations && this.cabHistory.locations.length > 0) {
        this.cabHistory.locations.forEach((element, index) => {


          if (element.trip) {
            console.log('yes')
            tempLocation.push(element);
            if (this.cabHistory.locations[index + 1]) {
              if (!this.cabHistory.locations[index + 1].trip || (this.cabHistory.locations[index + 1].trip && this.cabHistory.locations[index + 1].trip._id != element.trip._id)) {
                allLocations.push(tempLocation);
                tempLocation = [];
              }
            }
            else {
              allLocations.push(tempLocation);
              tempLocation = [];
            }
          }
          else {
            console.log('no')
            tempLocation.push(element);
            if (this.cabHistory.locations[index + 1]) {
              if (this.cabHistory.locations[index + 1].trip) {
                allLocations.push(tempLocation);
                tempLocation = [];
              }
            }
            else {
              allLocations.push(tempLocation);
              tempLocation = [];
            }

          }

          if (element.employee) {
            let employeelocation = new google.maps.LatLng(element.lat, element.long);
            // this.setMarker(employeelocation, element.employee, '../../../../assets/boss.png');
            this.setMarker(employeelocation, element.employee, '../../../../assets/boss.png','emp');
          }
        });
      }


      let length = 0;
      let halt = 0;
      let start;
      let end;
      allLocations.forEach((data, index) => {
        console.log(data);
        let dataMap = data.map((location, j) => {
          let haltTime;
          if (length == 0) {
            let startlocation = new google.maps.LatLng(location.lat, location.long);
            this.setMarker(startlocation, location.createdAt, '../../../../assets/se.png');
             
          }
          if ((index == allLocations.length - 1 && j == data.length - 1)) {
            let endlocation = new google.maps.LatLng(location.lat, location.long);

            this.setMarker(endlocation, location.createdAt, '../../../../assets/e.png');
          }
          // console.log(location.accuracy)
          if (!location.accuracy || location.accuracy < 800) {

            length = length + 1;
            let dotLocation = new google.maps.LatLng(location.lat, location.long);
            let prevLocation;
            let diff;
            if (data[j + 1]) {
              prevLocation = new google.maps.LatLng(data[j + 1].lat, data[j + 1].long);
            }
            if (data[j + 1]) {
              diff = location.lat > data[j + 1].lat ? location.lat - data[j + 1].lat : data[j + 1].lat - location.lat
            }

            if ((length == 1 || (diff ? diff > 0.001 : false))) {
              halt += 1;
              if (halt == 1) {
                // console.log(new Date(location.createdAt))
                start = moment(location.createdAt).format("HH:mm a");
              }

              if(halt >= 5){
                end = moment(location.createdAt).format("HH:mm a");
                haltTime = start + ' - ' + end;
                this.setMarker(dotLocation, haltTime, '../../../../assets/halt.png', 'diff');
              }
              halt = 0;
              // console.log('yes')
              this.addMarkerArrow(dotLocation, prevLocation,
                {
                  path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                  scale: 3,
                  strokeColor: 'red',
                  anchor: new google.maps.Point(0, 4),
                },
                location.createdAt
              );

            }
            else if ((diff ? diff <= 0.001 : false) && halt < 5) {
              halt += 1;
              if (halt == 1) {
                // console.log(new Date(location.createdAt))
                start = moment(location.createdAt).format("HH:mm a");
              }

              if (halt >= 5) {
                // console.log(new Date(location.createdAt))
                end = moment(location.createdAt).format("HH:mm a");
                haltTime = start + ' - ' + end;
               // this.setMarker(dotLocation, haltTime, '../../../../assets/halt.png','diff');
              }
            }
            return {
              lat: location.lat,
              lng: location.long
            }


          }

        });

        if (data[0].trip) {
          this.drawPolyline(lodash.without(dataMap, undefined), this.color[index]);
          let startlocation = new google.maps.LatLng(data[0].lat, data[0].long);
          this.setMarker(startlocation, data[0].createdAt, '../../../../assets/se.png');
          let endlocation = new google.maps.LatLng(data[data.length - 1].lat, data[data.length - 1].long);
          console.log('end marker')
          this.setMarker(endlocation, data[data.length - 1].createdAt, '../../../../assets/e.png');
          // if (data[0].trip.company && data[0].trip.company.address && data[0].trip.company.address.location) {
          //   let companylocation = new google.maps.LatLng(data[0].trip.company.address.location.lat, data[0].trip.company.address.location.long);
          //   this.setMarker(companylocation, data[0].trip.company, '../../../../assets/office.png');
          // }
        }
        else {
          this.drawPolyline((lodash.without(dataMap, undefined)), 'black');
        }
      })
    }
  }

  showCabMarker(location){
    let locationData = new google.maps.LatLng(location.lat, location.long);
    this.addCabMarker(locationData, '../../../../assets/marker.png',this.cabHistory);

  }


  resetMap() {
    this.allPolylines.forEach(element => {
      element.setMap(null);
    });
    this.deleteMarkers();
  }

  drawPolyline(allCordinates, color?) {
    var lineSymbol = {
      path: 'M 0,-1 0,1',
      strokeOpacity: 1,
      scale: 3
    };

    var flightPath = new google.maps.Polyline({
      path: allCordinates,
      geodesic: true,
      icons: [{
        icon: lineSymbol,
        offset: '0',
        repeat: '20px'
      }],
      strokeColor: color ? color : 'red',
      strokeOpacity: 0,
      // strokeWeight: 3
    });

    this.allPolylines.push(flightPath);

    flightPath.setMap(this.map);

  }

  setMarker(updatelocation, employee, img,  val?) {
    
    // let marker = this.markers.findIndex((element) => {
    //   return element.id == employee._id
    // });
    // if (marker == -1) {
    let image = img;
    // console.log(image)
    this.addMarker(updatelocation,employee, image, val);
   //  console.log(employee);
    this.setMapOnAll(this.map);
  }
  //   else {
  //     this.markers[marker].marker.setPosition(updatelocation);
  //   }
  // }  

  addMarkerArrow(location, prevLocation, icon, data) {
    // console.log(data)
    var infowindow = new google.maps.InfoWindow();
    // console.log(location, image)
    let iconData;
    if (prevLocation) {
      var heading = google.maps.geometry.spherical.computeHeading(location, prevLocation);
      iconData = { ...icon, ...{ rotation: heading } };
    }
    else {
      iconData = icon
    }
    let marker = new google.maps.Marker({
      position: location,
      map: this.map,
      icon: iconData
    }
    );

    this.map.setCenter(location);
    this.map.panTo(location);
    this.markers.push({ marker: marker, id: data });
    // console.log(this.markers, 'marker');
    google.maps.event.addListener(marker, 'click', (markerData) => {
    //  console.log(data)
      infowindow.setContent(data ? moment(data).format("MM-DD, HH:mm a") : '');
      infowindow.open(this.map, marker);
    });
  }

  addMarker(location,employee,image,val?) {
    // console.log('add marker',location.lat())
    var infowindow = new google.maps.InfoWindow();
     console.log(image);
     console.log(employee)
    let marker = new google.maps.Marker({
      position: location,
      map: this.map,
      icon: image 
    }
    );

     this.map.setCenter(location);
     this.map.panTo(location);
    // this.markers.push({ marker: marker, id: employee._id }); 
        this.markers.push({ marker: marker, id: employee });
    // console.log(employee);
    // console.log(this.markers, 'marker');
    google.maps.event.addListener(marker, 'click', (data) => {
       // console.log(data);
      if (val == 'diff') {
        infowindow.setContent(employee);
      }
      else {
        if(val == 'emp'){
          infowindow.setContent(employee.name + ' '+ moment(employee.createdAt).format("MM-DD, HH:mm a"));
        }
        else{
          infowindow.setContent(employee ? employee.name ? employee.name : moment(employee).format("MM-DD, HH:mm a") : '');
        }
      }
      infowindow.open(this.map, marker);
      // console.log(data)
    });
  }


  addCabMarker(location, image, data) {
    // console.log('add marker',location.lat())
    var infowindow = new google.maps.InfoWindow();
    // console.log(location, image)
    let marker = new google.maps.Marker({
      position: location,
      map: this.map,
      icon: image
    }
    );

    this.map.setCenter(location);
    this.map.panTo(location);
    this.markers.push({ marker: marker, id: data._id });
    this.getAddress(data.assigned_current_driver.address.location,marker,infowindow,data);
    // console.log(this.markers, 'marker');
   
  }

  getAddress(location,marker,infowindow,cabData){
    this.common.getAddress(location).subscribe(res =>{
      // console.log(res);
     let address = res['data'].results?res['data'].results[0].formatted_address:'';
    //  console.log(address);
     this.showInfoWindow(marker,infowindow,cabData,address);
    },(err) =>{
      this.showInfoWindow(marker,infowindow,cabData,'');
    })
  }

  showInfoWindow(marker,infowindow,cabData,address){
    google.maps.event.addListener(marker, 'click', (data) => {
      // console.log(data);
      // console.log(data)
      infowindow.setContent("<div><b style='color:#e3165b'>Vehicle Name </b>: " + cabData.name + "</div><div><b style='color:#e3165b'>Vehicle No. </b>: " + cabData.cab_number + "</div><div><b style='color:#e3165b'>Vehicle Model : </b>" + cabData.cab_model + "</div><div><b style='color:#e3165b'>Location : </b>" + address +"</div><div><b style='color:#e3165b'>Geo Coordinates : </b>" + cabData.assigned_current_driver.address.location.lat + ", " + cabData.assigned_current_driver.address.location.long + "</div><div><b style='color:#e3165b'>Date & Time : </b>" + moment(cabData.assigned_current_driver.address.location.createdAt).format("MM-DD, HH:mm a") + "</div>");
      infowindow.open(this.map, marker);
    });
    infowindow.setContent("<div><b style='color:#e3165b'>Vehicle Name </b>: " + cabData.name + "</div><div><b style='color:#e3165b'>Vehicle No. </b>: " + cabData.cab_number + "</div><div><b style='color:#e3165b'>Vehicle Model : </b>" + cabData.cab_model + "</div><div><b style='color:#e3165b'>Location : </b>" + address +"</div><div><b style='color:#e3165b'>Geo Coordinates : </b>" + cabData.assigned_current_driver.address.location.lat + ", " + cabData.assigned_current_driver.address.location.long + "</div><div><b style='color:#e3165b'>Date & Time : </b>" + moment(cabData.assigned_current_driver.address.location.createdAt).format("MM-DD, HH:mm a") + "</div>");
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

  // changeCab(event, val) {
  //   let data;
  //   if (val == 'cab') {
  //     this.cabId = event.value;
  //     data = {
  //       fromDate: this.form.value.date ? this.form.value.date.startDate ? this.form.value.date.startDate : '' : '',
  //       toDate: this.form.value.date ? this.form.value.date.endDate ? this.form.value.date.endDate : '' : '',
  //     }
  //   }
  //   else {
  //     data = {
  //       fromDate: event ? event.startDate ? event.startDate : '' : '',
  //       toDate: event ? event.endDate ? event.endDate : '' : '',
  //     }
  //   }
  //   this.getCabHistory(this.cabId,pickBy(data, identity));
  // }

  reset() {
    this.form.reset();
    if (this.cabId) {
      this.form.controls.cab.setValue(this.cabId);
      this.getStartHistory(this.cabId, { trip: this.tripId })
    }
    this.showClose = false;

  }

  showTrak(data) {
    this.showClose = true;
    this.cabId = data.cab;
    if (data.startDate) {
      data.startDate = new Date(data.startDate);
      if (data.startTime) {
        let stTime = data.startTime.split(':');
        data.startDate.setHours(stTime[0], stTime[1], 0, 0);
      }

      data.startDate = data.startDate ? moment.utc(data.startDate) : null;
    }
    if (data.endDate) {
      data.endDate = new Date(data.endDate);
      if (data.endTime) {
        let enTime = data.endTime.split(':');
        data.endDate.setHours(enTime[0], enTime[1], 0, 0);
      }
      else {
        data.endDate.setHours(23, 59, 59, 999);
      }
      data.endDate = data.endDate ? moment.utc(data.endDate) : null;
    }

    let formData = {
      fromDate: data.startDate ? data.startDate : "",
      toDate: data.endDate ? data.endDate : "",
    }
    this.getStartHistory(data.cab, { ...pickBy(formData, identity), ...{ trip: this.tripId } });
  }

  goBack(){
    if(this.tripId){
      this.router.navigate(['/trips']);
    }
    else{
      this.router.navigate(['/cabs']);
    }
  }

}
