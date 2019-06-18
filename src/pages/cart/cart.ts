import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Events } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the CartPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage {

  showGrand:any;

  status:any;
  shipping:any;
  grand:any;
  cart:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public http:HttpClient,
    public storage:Storage,public loadingCtrl:LoadingController,
    public events:Events) {
    this.navCtrl = navCtrl;
    this.navParams = navParams;
    this.http = http;
    this.storage = storage;
    this.loadingCtrl = loadingCtrl;
    this.events = events;
    this.showGrand = false;
}
ionViewDidLoad() {
    console.log('ionViewDidLoad CartPage');
};

ionViewDidEnter() {
    var _this = this;
    this.storage.get('USER_KEY').then(function (val) {
        var loading = _this.loadingCtrl.create({
            content: 'Please wait...'
        });
        loading.present();
        _this.http.get('http://43.225.52.47/~swasthyashoppe/api/cart.php?uid=' + val).subscribe(function (data) {
            console.log(data);
            _this.status = data[0]['status'];
            _this.grand = data[0]['grand'];
            _this.shipping = data[0]['shipping'];
            _this.showGrand = true;
            _this.cart = data[0];
            console.log(_this.cart);
            loading.dismiss();
        });
    }, function (error) {
        console.log(error);
        console.log('not set');
    });
};
upQty(pid) {
    var _this = this;
    this.storage.get('USER_KEY').then(function (val) {
        var loading = _this.loadingCtrl.create({
            content: 'Updating cart...'
        });
        loading.present();
        _this.http.get('http://43.225.52.47/~swasthyashoppe/api/cart.php?uid=' + val + '&pid=' + pid + '&do=up').subscribe(function (data) {
            console.log(data);
            _this.status = data[0]['status'];
            _this.grand = data[0]['grand'];
            _this.showGrand = true;
            _this.cart = data[0];
            loading.dismiss();
        });
    });
};
downQty(pid) {
    var _this = this;
    this.storage.get('USER_KEY').then(function (val) {
        var loading = _this.loadingCtrl.create({
            content: 'Updating cart...'
        });
        loading.present();
        _this.http.get('http://43.225.52.47/~swasthyashoppe/api/cart.php?uid=' + val + '&pid=' + pid + '&do=down').subscribe(function (data) {
            console.log(data);
            _this.status = data[0]['status'];
            _this.grand = data[0]['grand'];
            _this.showGrand = true;
            _this.cart = data[0];
            loading.dismiss();
        });
    });
};
remove(pid) {
    var _this = this;
    this.storage.get('USER_KEY').then(function (val) {
        var loading = _this.loadingCtrl.create({
            content: 'Removing item...'
        });
        loading.present();
        _this.http.get('http://43.225.52.47/~swasthyashoppe/api/cart.php?uid=' + val + '&pid=' + pid + '&do=remove').subscribe(function (data) {
            console.log(data);
            _this.status = data[0]['status'];
            _this.grand = data[0]['grand'];
            _this.showGrand = true;
            _this.cart = data[0];
            loading.dismiss();
            _this.events.publish('cart:removed', 1, Date.now());
        });
    });
};
viewProduct(id, name, image, short_desc, price) {
    console.log(name);
    console.log(id);
    console.log(image);
    this.navCtrl.push('ProductPage', { id: id, name: name, image: image, short_desc: short_desc, price: price });
};
checkout() {
    this.navCtrl.push('CheckoutPage');
};

}
