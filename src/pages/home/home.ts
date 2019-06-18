import { Component } from '@angular/core';
import { NavController, LoadingController, Events } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Keyboard } from '@ionic-native/keyboard';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { StatusBar } from '@ionic-native/status-bar';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  cats: any;
  prods: any;
  banners: any;
  brands: any; toggled: any;
  constructor(public navCtrl: NavController, public http: HttpClient,
    public loadingCtrl: LoadingController, public events: Events,
    public storage: Storage,
    private statusBar: StatusBar,
    public keyboard: Keyboard) {
    var _this = this;
    this.navCtrl = navCtrl;
    this.http = http;
    this.loadingCtrl = loadingCtrl;
    this.events = events;
    this.storage = storage;
    this.keyboard = keyboard;
    this.toggled = false;
    this.statusBar.backgroundColorByHexString('#66af2e');
    this.statusBar.styleLightContent();
    var loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    this.http.get('http://swasthyashoppe.com/api/categories.php').subscribe(function (data) {
      //console.log(data);
      _this.cats = data;
    });
    this.storage.get('DEVICE_TOKEN').then(function (token) {
      _this.storage.get('USER_KEY').then(function (val) {
        _this.http.get('http://swasthyashoppe.com/api/home.php?action=cart&uid=' + val).subscribe(function (data3) {
          _this.events.publish('cart:added', data3['cart'], Date.now());
        });
        console.log('http://swasthyashoppe.com/api/home.php?uid=' + val + '&token=' + token);
        _this.http.get('http://swasthyashoppe.com/api/home.php?uid=' + val + '&token=' + token).subscribe(function (data2) {
          console.log(data2);
          _this.prods = data2;
          _this.http.get('http://swasthyashoppe.com/api/brands.php').subscribe(function (data3) {
            console.log(data3);
            _this.brands = data3;
            loading.dismiss();
          });
        });
        _this.http.get('http://swasthyashoppe.com/api/banners.php').subscribe(function (data4) {
          console.log(data4);
          if (data4 != '') {
            _this.banners = data4;
          }
        });
      });
    });
  }
  featured: any;
  searchbar: any;
  toggle() {
    var _this = this;
    this.toggled = !this.toggled;
    if (this.toggled) {
      setTimeout(function () {
        _this.searchbar.setFocus();
        _this.http.get('http://43.225.52.47/~swasthyashoppe/api/featured.php').subscribe(function (data3) {
          console.log(data3);
          _this.featured = data3;
        });
      }, 50);
    }
  }
  cancelSearch(event) {
    this.toggled = false;
  }
  cat(id, name) {
    this.navCtrl.push('CatPage', { id: id, name: name });
  }
  brand(id, name) {
    this.navCtrl.push('BrandsPage', { id: id, brand: name });
  }
  allBrand() {
    this.navCtrl.push('AllBrandsPage');
  }
  product(id, name, image, short_desc, price, video, stock) {
    this.navCtrl.push('ProductPage', { id: id, name: name, image: image, short_desc: short_desc, price: price, video: video, stock: stock });
  }
  searchString: any;
  searchThis(event) {
    var _this = this;
    console.log(event);
    this.toggled = true;
    console.log(this.searchString);
    this.http.get('http://swasthyashoppe.com/api/featured.php?search=' + this.searchString).subscribe(function (data3) {
      console.log(data3);
      _this.featured = data3;
    });
  }
  openCart() {
    this.navCtrl.parent.select(2);
  }
  ionViewDidEnter() {
    var _this = this;
    this.keyboard.onKeyboardShow().subscribe(function () { _this.toggled = true; });
    this.keyboard.onKeyboardHide().subscribe(function () { _this.toggled = false; });
  }
}
