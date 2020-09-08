import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { HomePage } from '../home/home';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the TabsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {
  tab1Root = HomePage;
  tab2Root = 'WishlistPage';
  tab3Root = 'CartPage';
  tab4Root = 'OrdersPage';
  tab5Root = 'SettingPage';
  cartBadge = 0;
  constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events, private statusBar: StatusBar,
    private storage: Storage,private http: HttpClient,) {
    var that = this;
    that.statusBar.backgroundColorByHexString('#66af2e');
    that.statusBar.styleLightContent();
    events.subscribe('cart:added', function (count, time) {
      // user and time are the same arguments passed in `events.publish(user, time)`
      that.cartBadge = +that.cartBadge + +count;
    });
    events.subscribe('cart:removed', function (count, time) {
      // user and time are the same arguments passed in `events.publish(user, time)`
      that.cartBadge = that.cartBadge - count;
    });
    events.subscribe('cart:set', function (count, time) {
      // user and time are the same arguments passed in `events.publish(user, time)`
      that.cartBadge = count;
    });
    that.storage.get('USER_KEY').then(function (val) {
      that.http.get('http://swasthyashoppe.com/api/wallet.php?uid=' + val).subscribe(function (data) {
         // _this.wallet_balance = data['balance'];
         // _this.customer_name = data['name'];
         that.events.publish('wallet_balanced',data['balance'], Date.now());
         that.events.publish('customer_name', data['name'], Date.now());
          console.log(data);
          
      });
  });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad TabsPage');
  }

}
