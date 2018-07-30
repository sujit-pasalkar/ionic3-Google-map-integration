import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, MenuController } from 'ionic-angular';
import { LoadProvider } from '../../providers/load/load';
@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage 
 {
  searchQuery: string = '';
  loc: any[];
  serachFor;

  constructor(public navCtrl: NavController , 
     public navParams: NavParams, 
     public loadProvider: LoadProvider,
     public event: Events,
     public menu: MenuController,
  ) {
    this.serachFor = navParams.get('key');
    this.initializeLoc();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
  }

  initializeLoc() {
    this.loc = [
      {
        "title": "Kondhwa",
        "latitude": 18.4771,
        "longitude": 73.8907
      },
      {
        "title": "Katraj Depo",
        "latitude": 18.4575,
        "longitude": 73.8677
      },
      {
        "title": "Swarget ",
        "latitude": 18.5018,
        "longitude": 73.8636
      },
      {
        "title": "Baner Pune",
        "latitude": 18.5590,
        "longitude": 73.7868
      },
      {
        "title": "Hadapsar",
        "latitude": 18.5089,
        "longitude": 73.9260
      },
      {
        "title": "Camp pune",
        "latitude": 18.5122,
        "longitude": 73.8860
      },
      {
        "title": "Uruli Kanchan",
        "latitude": 18.456001, 
      "longitude": 73.956782
      },
      {
        "title": "Wanodari ",
        "latitude": 73.956782,
        "longitude": 73.9017
      },
      {
        "title": "Dhankawadi, Bharati Vidyapeeth",
        "latitude": 18.4616,
        "longitude": 73.8505
      }
    ];
  }

  searchInput(ev: any) {
    this.initializeLoc();
    // set val to the value of the searchbar
    const val = ev.target.value;
    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.loc = this.loc.filter((item) => {
        return (item.title.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }
  // onCancel($event){
  // }

  route(lat,lng,title){
    if(this.serachFor)
    {
      this.loadProvider.start = title;
      this.loadProvider.loadInitMap(lat, lng);
    }
    else{
      this.loadProvider.end = title;
      this.event.publish('route', { lat, lng });
    }
      this.navCtrl.pop();
  }

  YourLoc(){
    this.loadProvider.start = "Your Location";
    this.navCtrl.pop();
    this.loadProvider.loadInitMap(this.loadProvider.latitude,this.loadProvider.longitude);
  }

}
