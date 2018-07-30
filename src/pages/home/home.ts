import { Component, ViewChild, ElementRef} from '@angular/core';
import { NavController, Events, MenuController } from 'ionic-angular';
import { SearchPage } from '../search/search'
import { LoadProvider } from '../../providers/load/load';

declare var google;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('directionsPanel') directionsPanel: ElementRef;

  map: any;
  // infoCard: boolean = true;
  // km;
  // mins;
  latLng;
  mapNotLoading: boolean = true;
  showRout : boolean =false;

  constructor(public navCtrl: NavController,
    public loadProvider: LoadProvider,
    public event: Events,
    public menu: MenuController
    // public geofence: Geofence
    ) {
      //#geofence
        // geofence.initialize().then(
        //   () => console.log('Geofence Plugin Ready'),
        //   (err) => console.log(err));
          //#1
          this.event.subscribe("userCurrentLocation",(val) =>{
            this.loadProvider.toast("Your current loaction is " + val);
           })
           ///#2
          this.event.subscribe("latlong", (val) => {
            this.initMap(this.loadProvider.latitude,this.loadProvider.longitude);
          // this.getPlaces(this.loadProvider.latitude, this.loadProvider.longitude);
          })
          //#3
          this.event.subscribe("route", (val) => {
            this.displayRoute( val.lat,val.lng);
          })
          //#4
          this.event.subscribe("loadInitMap", (val) => {
            this.initMap(val.lat, val.lng);
          })

  }

  ionViewDidLoad() {
    this.menu.swipeEnable(false);
  }

  initMap(lat,lng) {
    this.latLng = new google.maps.LatLng(lat, lng);
    this.mapNotLoading = false;
    let mapOptions = {
      center: this.latLng,
      zoom: 10,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    //#marker
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()
    });
    let content = "<h4>Your Location</h4>";
    this.addInfoWindow(marker, content);

    //#geofence
    // this.getPlaces(lat, lng);

  }

  //#continue info
  addInfoWindow(marker, content) {
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });
    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
  }

  displayRoute(lat,lng) {
    let latlng2 = new google.maps.LatLng(lat, lng);
    let directionsService = new google.maps.DirectionsService;
    let directionsDisplay = new google.maps.DirectionsRenderer;
    this.showRout = true;
    //#new route
    directionsDisplay.setMap(null);
    directionsDisplay.setPanel(null);

    directionsDisplay.setMap(this.map);
    directionsDisplay.setPanel(this.directionsPanel.nativeElement);
    // directionsDisplay.setOptions({ suppressMarkers: true });
    directionsService.route({
      origin: this.latLng,
      destination: latlng2,
      travelMode: google.maps.TravelMode['DRIVING'],
    }, (res, status) => {
      if (status  == google.maps.DirectionsStatus.OK) {
        // console.log("route resp : " + JSON.stringify(res.routes[0].legs[0].distance.text));
        // this.km = res.routes[0].legs[0].distance.text;
        // this.mins = res.routes[0].legs[0].duration.text;
        // this.infoFooter = true; 
        directionsDisplay.setDirections(res); 
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }

  searchStart(){
    this.navCtrl.push(SearchPage,{"key":true});
  }

  searchEnd(){
    this.navCtrl.push(SearchPage,{ "key": false});
  }

  //#geofence
  // getPlaces(lat,lng) {
  //   console.log("in gateplace()")
  //   this.latLng = new google.maps.LatLng(lat, lng);
  //   getPlaceMap = new google.maps.Map(document.getElementById('map'), {
  //     center: this.latLng,
  //     zoom: 10
  //   });
  //   let service = new google.maps.places.PlacesService(getPlaceMap);
  //   service.nearbySearch({
  //     location: { lat: lat, lng: lng },
  //     radius: 500,
  //     type: ['restaurant']
  //   }, (results, status) => {
  //     if (status === google.maps.places.PlacesServiceStatus.OK) {
  //       console.log("in gateplace()..got status")
  //       for (var i = 0; i < results.length; i++) {
  //         console.log(results[i]);
  //         this.addGeofence(results[i].id, i + 1, results[i].geometry.location.lat(), results[i].geometry.location.lng(), results[i].name, results[i].vicinity);
  //       }
  //     }
  //   });
  // }

  //#cont geofence
  // public addGeofence(id, idx, lat, lng, place, desc) {
  //   let fence = {
  //     id: id,
  //     latitude: lat,
  //     longitude: lng,
  //     radius: 50,
  //     transitionType: 3,
  //     notification: {
  //       id: idx,
  //       title: 'You crossed ' + place,
  //       text: desc,
  //       openAppOnClick: true
  //     }
  //   }

  //   this.geofence.addOrUpdate(fence).then(
  //     () => console.log('Geofence added'),
  //     (err) => console.log('Geofence failed to add')
  //   );
  // }
}
