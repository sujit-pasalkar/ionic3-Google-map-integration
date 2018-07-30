// import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IonicPage, NavParams, LoadingController, Loading, Platform, AlertController, ToastController, Events } from 'ionic-angular';

import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult } from '@ionic-native/native-geocoder';
import { LocationAccuracy } from '@ionic-native/location-accuracy';

@Injectable()
export class LoadProvider {

  public start = ' ';
  public end = ' ';
  public latitude: any;
  public longitude: any;
  public userCurrentLocation:any;

  constructor(//public http: HttpClient,
    public geolocation: Geolocation,
    public geocoder: NativeGeocoder,
    public locac: LocationAccuracy, 
    public platform: Platform,
    public toastCtrl: ToastController,
    public event: Events,
   ){
      this.geolocation.getCurrentPosition().then((resp) => {
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;
       this.event.publish('latlong',true)
    }).catch((error) => {
      // console.log('Error getting location', error);
    });
  }

  //#forword geocoder(text form)
  async getUserLocation() {
    await this.geocoder.reverseGeocode(this.latitude, this.longitude)
        .then((result:NativeGeocoderReverseResult[]) => {
            this.userCurrentLocation = "";
            if (result[0].subLocality) {
              this.userCurrentLocation = this.userCurrentLocation + result[0].subLocality + ", ";
            }
            if (result[0].subAdministrativeArea) {
              this.userCurrentLocation = this.userCurrentLocation + result[0].subAdministrativeArea + ", ";
            }
            if (result[0].thoroughfare) {
              this.userCurrentLocation = this.userCurrentLocation + result[0].thoroughfare + ", ";
              }
            this.userCurrentLocation = this.userCurrentLocation + result[0].administrativeArea + ", " ;
          this.event.publish('userCurrentLocation', this.userCurrentLocation);

          })
          .catch((error: any) =>{
            console.log("NativeGeocoderReverseResultError: " + error)
          // this.toast("slow network/geocoder err:");
          }
        );
  }

  //#enable location again
  async enableLocation() {
    await this.locac.canRequest().then((canRequest: boolean) => {
      if (canRequest) {
        // the accuracy option will be ignored by iOS
        this.locac.request(this.locac.REQUEST_PRIORITY_HIGH_ACCURACY).then(res => {
          this.getUserLocation();
        }).catch(err => {
           this.toast("No Location Access.");
        });
      }
    });
  }

  loadInitMap(lat,lng)
  {
    this.event.publish("loadInitMap",{lat,lng});
  }
  
  toast(msg){
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
    toast.present();
  }
}
