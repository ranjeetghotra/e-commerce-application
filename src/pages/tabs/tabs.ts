import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { HomePage } from '../home/home';
import { StatusBar } from '@ionic-native/status-bar';

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
  constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events, private statusBar: StatusBar) {
    var that = this;
    that.statusBar.backgroundColorByHexString('#66af2e');
    that.statusBar.styleLightContent();
    events.subscribe('cart:added', function (count, time) {
      // user and time are the same arguments passed in `events.publish(user, time)`
      that.cartBadge = that.cartBadge + count;
    });
    events.subscribe('cart:removed', function (count, time) {
      // user and time are the same arguments passed in `events.publish(user, time)`
      that.cartBadge = that.cartBadge - count;
    });
    events.subscribe('cart:set', function (count, time) {
      // user and time are the same arguments passed in `events.publish(user, time)`
      that.cartBadge = count;
    });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad TabsPage');
  }

}
