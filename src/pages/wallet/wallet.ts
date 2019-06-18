import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the WalletPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-wallet',
  templateUrl: 'wallet.html',
})
export class WalletPage {
  current:any;
  showCurrent:any;
  deposit:any;
  section:any;
  email:any;
  phone:any;
  name:any;
  myid:any;
constructor(public navCtrl:NavController,
  public navParams:NavParams,public storage: Storage,public  http:HttpClient,
  public alertCtrl:AlertController,public toastCtrl:ToastController) {
    var _this = this;
    this.navCtrl = navCtrl;
    this.navParams = navParams;
    this.storage = storage;
    this.http = http;
    this.alertCtrl = alertCtrl;
    this.toastCtrl = toastCtrl;
    this.current = 0;
    this.showCurrent = false;
    this.deposit = 100;
    this.section = this.navParams.get('section');
    this.storage.get('USER_KEY').then(function (val) {
        _this.http.get('http://43.225.52.47/~swasthyashoppe/api/wallet.php?uid=' + val).subscribe(function (data) {
            _this.current = data['balance'];
            _this.email = data['email'];
            _this.phone = data['phone'];
            _this.name = data['name'];
            _this.showCurrent = true;
            _this.myid = val;
            console.log(data);
        });
    });
    if (this.section == 'history') {
        this.storage.get('USER_KEY').then(function (val) {
            _this.http.get('http://43.225.52.47/~swasthyashoppe/api/wallet.php?action=history&uid=' + val).subscribe(function (data) {
                _this.history = data;
                console.log(data);
            });
        });
    }
}
history:any;
ionViewDidLoad() {
    console.log('ionViewDidLoad WalletPage');
};
doDeposit() {
    if (this.deposit > 0) {
        var options = {
            description: 'Credits towards consultation',
            image: 'https://i.imgur.com/3g7nmJC.png',
            currency: 'INR',
            key: 'rzp_test_1DP5mmOlF5G5ag',
            amount: this.deposit * 100,
            name: "Swasthya Shopee",
            prefill: {
                email: this.email,
                contact: this.phone,
                name: this.name
            },
            theme: {
                color: '#F37254'
            },
            modal: {
                ondismiss: function () {
                    alert('dismissed');
                }
            }
        };
       // var cancelCallback(error) {
         //   console.log(error.description + ' (Error ' + error.code + ')');
        //};
       // RazorpayCheckout.open(options, this.successCallback, cancelCallback);
    }
    else {
        var alert_1 = this.alertCtrl.create({
            title: 'Invalid Amount',
            subTitle: 'Please enter a valid amount to deposit',
            buttons: ['OK']
        });
        alert_1.present();
    }
};
successCallback(payment_id) {
    var _this = this;
    this.http.get('http://43.225.52.47/~swasthyashoppe/api/wallet.php?action=deposit&uid=' + this.myid + '&amount=' + this.deposit).subscribe(function (data) {
        alert('in');
        if (data['status'] == 'OK') {
            _this.current = _this.current + _this.deposit;
            var toast = _this.toastCtrl.create({
                message: 'Amount successfully credited to your wallet',
                duration: 3000,
                position: 'bottom'
            });
            toast.present();
        }
        else {
            var toast = _this.toastCtrl.create({
                message: 'Something went wrong. Please try again',
                duration: 3000,
                position: 'bottom'
            });
            toast.present();
        }
    });
};
}
