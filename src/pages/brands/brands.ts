import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';

/**
 * Generated class for the BrandsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-brands',
  templateUrl: 'brands.html',
})
export class BrandsPage {
title:any;
products:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public loadingCtrl:LoadingController,public http:HttpClient) {
 
    var _this = this;
    this.navCtrl = navCtrl;
    this.navParams = navParams;
    this.http = http;
    this.loadingCtrl = loadingCtrl;
    this.title = '';
    this.title = this.navParams.get('brand');
    var loading = this.loadingCtrl.create({
        content: 'Please wait...'
    });
    this.http.get('http://43.225.52.47/~swasthyashoppe/api/products.php?brand=' + this.navParams.get('id')).subscribe(function (data) {
        console.log(data);
        _this.products = data;
        loading.dismiss();
    });
}
ionViewDidLoad() {
    console.log('ionViewDidLoad BrandsPage');
};
product(id, name, image, short_desc, price, video) {
    this.navCtrl.push('ProductPage', { id: id, name: name, image: image, short_desc: short_desc, price: price, video: video });
};
}
