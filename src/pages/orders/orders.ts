import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the OrdersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-orders',
    templateUrl: 'orders.html',
})
export class OrdersPage {
    orderSeg: any;
    constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpClient, public storage: Storage) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.http = http;
        this.storage = storage;
        this.orderSeg = 'ongoing';
    }
    ongoing: any;
    ionViewWillEnter() {
        var _this = this;
        console.log('ionViewDidLoad OrdersPage');
        this.storage.get('USER_KEY').then(function (val) {
            _this.http.get('http://swasthyashoppe.com/api/orders.php?uid=' + val + '&section=ongoing').subscribe(function (data) {
                _this.ongoing = data;
            });
        });
    };
    completed: any;
    segmentChanged(event) {
        var _this = this;
        if (event['_value'] == 'history') {
            this.storage.get('USER_KEY').then(function (val) {
                _this.http.get('http://swasthyashoppe.com/api/orders.php?uid=' + val + '&section=history').subscribe(function (data) {
                    _this.completed = data;
                });
            });
        }
        else {
            _this.ionViewWillEnter();
        }
    };
    detail(oid) {
        this.navCtrl.push('DetailPage', { oid: oid });
    };
}
