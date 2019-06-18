import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the AccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage {
 fname :any;
           lname :any;
           email:any;
           phone :any;
           address1:any;
           address2 :any;
           city:any;
           state :any;
           country :any;
           zip:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public http:HttpClient,
    public storage:Storage, public toastCtrl:ToastController, public loadingCtrl:LoadingController) {
    this.navCtrl = navCtrl;
    this.navParams = navParams;
    this.http = http;
    this.storage = storage;
    this.toastCtrl = toastCtrl;
    this.loadingCtrl = loadingCtrl;
}
ionViewWillEnter () {
    var _this = this;
    this.storage.get('USER_KEY').then(function (val) {
        var loader = _this.loadingCtrl.create({
            content: "Please wait...",
            duration: 3000
        });
        loader.present();
        _this.http.get('http://43.225.52.47/~swasthyashoppe/api/account.php?uid=' + val).subscribe(function (data) {
            _this.fname = data['fname'];
            _this.lname = data['lname'];
            _this.email = data['email'];
            _this.phone = data['phone'];
            _this.address1 = data['address1'];
            _this.address2 = data['address2'];
            _this.city = data['city'];
            _this.state = data['state'];
            _this.country = data['country'];
            _this.zip = data['zip'];
            loader.dismiss();
        });
    });
};
update () {
    var _this = this;
    this.storage.get('USER_KEY').then(function (val) {
        _this.http.get('http://43.225.52.47/~swasthyashoppe/api/account.php?action=update&uid=' + val + '&fname=' + _this.fname + '&lname=' + _this.lname + '&phone=' + _this.phone + '&address1=' + _this.address1 + '&address2=' + _this.address2 + '&city=' + _this.city + '&state=' + _this.state + '&country=' + _this.country + '&zip=' + _this.zip).subscribe(function (data) {
            if (data['status'] == 'OK') {
                var toast = _this.toastCtrl.create({
                    message: data['msg'],
                    duration: 3000,
                    position: 'bottom',
                    showCloseButton: true
                });
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
};
}
