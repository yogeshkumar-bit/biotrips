import { Directive, ElementRef, OnInit, Output, Input, EventEmitter } from '@angular/core';

declare var google: any;

@Directive({
  selector: '[appGooglePlaces]'
})
export class GooglePlacesDirective implements OnInit{
  @Output() select: EventEmitter<any> = new EventEmitter();
  private element: HTMLInputElement;
  constructor(elRef: ElementRef) {
    this.element = elRef.nativeElement;
   }

  getFormattedAddress(place) {
    // @params: place - Google Autocomplete place object
    // @returns: location_obj - An address object in human readable format
    let location_obj = {};
    location_obj['formatted_address'] = place.formatted_address;
    location_obj['lat'] = place.geometry.location.lat();
    location_obj['lng'] = place.geometry.location.lng();
    location_obj['location'] = place.geometry.location;
    location_obj['name'] = place.name;
    place.address_components.forEach(element => {
      if (element['types'].indexOf('locality') > -1) {
        location_obj['locality'] = element['long_name'];
      } else if (element['types'].indexOf('administrative_area_level_1') > -1) {
        location_obj['admin_area_l1'] = element['long_name'];
      } else if (element['types'].indexOf('street_number') > -1) {
        location_obj['street_number'] = element['short_name'];
      } else if (element['types'].indexOf('route') > -1) {
        location_obj['route'] = element['long_name'];
      } else if (element['types'].indexOf('country') > -1) {
        location_obj['country'] = element['long_name'];
      } else if (element['types'].indexOf('postal_code') > -1) {
        location_obj['postal_code'] = element['short_name'];
      } else if (element['types'].indexOf('sublocality_level_2') > -1) {
        location_obj['subArea1'] = element['short_name'];
      } else if (element['types'].indexOf('sublocality_level_3') > -1) {
        location_obj['subArea2'] = element['short_name'];
        // location_obj['subArea1'] = location_obj['subArea1'] ? `${location_obj['subArea1']}, ${element['short_name']}` : element['short_name'];
          // if (location_obj['subArea1'] > -1) {
          //   location_obj['subArea1'] = `${location_obj['subArea2']}, ${location_obj['subArea1']}`;
          // }
      } else if (element['types'].indexOf('sublocality_level_1') > -1) {
        location_obj['area'] = element['short_name'];
      } else if (element['types'].indexOf('sublocality_level_2') > -1) {
        location_obj['line1'] = element['short_name'];
      }
    });
    return location_obj;
  }


  ngOnInit() {
    // let geolocation = {
    //   lat: 28.4591471,
    //   lng: 77.0703387
    // };
    // let circle = new google.maps.Circle({
    //   center: geolocation,
    //   radius: 3963.0
    // });


    // autocomplete.setBounds(circle.getBounds());
    /////////
    // let defaultBounds = new google.maps.LatLngBounds(
    //   new google.maps.LatLng(28.6503087, 77.33882549999998),
    //   new google.maps.LatLng(28.4228855, 76.8493522)
    // );
    let myLatlng = new google.maps.LatLng(28.4228855, 76.8493522);
    let options = {
      // bounds: defaultBounds,
      // types: ['(cities)'],
      // types: ['establishment'],
      // types: ['geocode'],
      location: myLatlng,
      radius: 80000,  // (in meters; this is 150Km)
      componentRestrictions: { country: ['in'] }
    };
    console.log(options)
    const autocomplete = new google.maps.places.Autocomplete(this.element, options);
    // autocomplete.setBounds(circle.getBounds());
    // autocomplete.bindTo('bounds', 'map');



    // if (navigator.geolocation) {
    //   navigator.geolocation.getCurrentPosition((position) => {
    //     let geolocation1 = {
    //       lat: position.coords.latitude,
    //       lng: position.coords.longitude
    //       // lat: 28.4228855,
    //       // lng: 76.8493522
    //     };
    //     let circle1 = new google.maps.Circle({
    //       center: geolocation1,
    //       radius: position.coords.accuracy
    //     });
    //     autocomplete.setBounds(circle1.getBounds());
    //   });
    // }



    // Event listener to monitor place changes in the input
    google.maps.event.addListener(autocomplete, 'place_changed', () => {
      // Emit the new address object for the updated place
      // center: new google.maps.LatLng(41.923, 12.513),
      this.select.emit(this.getFormattedAddress(autocomplete.getPlace()));
    });
  }
}
