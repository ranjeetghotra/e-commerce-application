import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, AlertController, Events } from 'ionic-angular';
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
    current: number;
    showCurrent: any;
    deposit: number;
    section: any;
    email: any;
    phone: any;
    name: any;
    myid: any;
    constructor(public navCtrl: NavController,
        public navParams: NavParams, public storage: Storage, public http: HttpClient,
        public alertCtrl: AlertController, public toastCtrl: ToastController, public events: Events,) {
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
            _this.http.get('http://swasthyashoppe.com/api/wallet.php?uid=' + val).subscribe(function (data) {
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
                _this.http.get('http://swasthyashoppe.com/api/wallet.php?action=history&uid=' + val).subscribe(function (data) {
                    _this.history = data;
                    console.log(data);
                });
            });
        }
    }
    history: any;
    ionViewDidLoad() {
        console.log('ionViewDidLoad WalletPage');
    };
    doDeposit() {
        var _this = this;
        if (_this.deposit > 0) {
            var options = {
                description: 'Payment towards selected items',
                image: 'https://i.imgur.com/o4iSJQk.jpg',
                currency: 'INR',
                key: 'rzp_test_1DP5mmOlF5G5ag',
                amount: _this.deposit * 100,
                name: "Swasthya Shopee",
                prefill: {
                    email: _this.email,
                    contact: _this.phone,
                    name: _this.name
                },
                theme: {
                    color: '#5fa62a'
                },
                modal: {
                    ondismiss: function () {
                        alert('dismissed');
                    }
                }
            };
            var successCallback = function (payment_id) {
                _this.walletsuccess(payment_id);
            };
            var cancelCallback = function (error) {
                alert(error.description + ' (Error ' + error.code + ')');
            };
            RazorpayCheckout.open(options, successCallback, cancelCallback);
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
    walletsuccess(payment_id) {
        var _this = this;
        _this.http.get('http://swasthyashoppe.com/api/wallet.php?action=deposit&uid=' + _this.myid + '&amount=' + _this.deposit).subscribe(function (data) {
            alert('in');
            if (data['status'] == 'OK') {
                _this.current = +_this.current + +_this.deposit;
                _this.events.publish('wallet_balanced',_this.current, Date.now());
                var toast = _this.toastCtrl.create({
                    message: 'Amount successfully credited to your wallet',
                    duration: 3000,
                    position: 'bottom'
                });
                toast.present();
                _this.navCtrl.parent.select(4);
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
