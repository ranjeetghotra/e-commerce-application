import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, Events } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the WishlistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-wishlist',
  templateUrl: 'wishlist.html',
})
export class WishlistPage {

  status:any;wished:any;
  constructor(public navCtrl:NavController, public navParams:NavParams,
    public http:HttpClient,
    public storage:Storage,public loadingCtrl:LoadingController,
    public events:Events,
    public toastCtrl:ToastController) {
    this.navCtrl = navCtrl;
    this.navParams = navParams;
    this.events = events;
    this.http = http;
    this.storage = storage;
    this.loadingCtrl = loadingCtrl;
    this.toastCtrl = toastCtrl;
}
ionViewDidLoad() {
    console.log('ionViewDidLoad WishlistPage');
}
ionViewDidEnter() {
    var _this = this;
    this.storage.get('USER_KEY').then(function (val) {
        var loading = _this.loadingCtrl.create({
            content: 'Please wait...'
        });
        loading.present();
        _this.http.get('http://43.225.52.47/~swasthyashoppe/api/wishlist.php?action=list&uid=' + val).subscribe(function (data) {
            console.log(data);
            _this.status = data[0]['status'];
            console.log(data[0]['status']);
            console.log('work');
            _this.wished = data[0];
            loading.dismiss();
        });
    }, function (error) {
        console.log(error);
        console.log('not set');
    });
}
remove(pid) {
    var _this = this;
    this.storage.get('USER_KEY').then(function (val) {
        var loading = _this.loadingCtrl.create({
            content: 'Removing...'
        });
        loading.present();
        _this.http.get('http://43.225.52.47/~swasthyashoppe/api/removeFromWish.php?product_id=' + pid + '&uid=' + val).subscribe(function (data) {
            console.log(data);
            var toast = _this.toastCtrl.create({
                message: data['msg'],
                duration: 3000,
                position: 'bottom',
                showCloseButton: true
            });
            toast.present();
            if (data['status'] == 'OK') {
                _this.ionViewDidEnter();
            }
            loading.dismiss();
        });
    });
}
viewProduct(id, name, image, short_desc, price) {
    console.log(name);
    console.log(id);
    console.log(image);
    this.navCtrl.push('ProductPage', { id: id, name: name, image: image, short_desc: short_desc, price: price });
}
addToCart(pid) {
    var _this = this;
    console.log(pid);
    this.storage.get('USER_KEY').then(function (val) {
        console.log('User Key is', val);
        _this.http.get('http://43.225.52.47/~swasthyashoppe/api/addToCart.php?product=' + pid + '&uid=' + val).subscribe(function (data) {
            //console.log(data);
            console.log(data);
            if (data['status'] == 'OK') {
                var toast = _this.toastCtrl.create({
                    message: data['msg'],
                    duration: 3000,
                    position: 'bottom',
                    showCloseButton: true
                });
                _this.events.publish('cart:added', 1, Date.now()); 
                toast.present();
            }
            else {
                var toast = _this.toastCtrl.create({
                    message: data['msg'],
                    duration: 3000,
                    position: 'bottom',
                    showCloseButton: true
                });
                toast.present();
            }
        });
    });
  }

}
