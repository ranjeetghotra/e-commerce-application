import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser';

/**
 * Generated class for the SettingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,public storage: Storage,
    public app:App, public iab: InAppBrowser) {
    this.navCtrl = navCtrl;
    this.storage = storage;
    this.app = app;
    this.iab = iab;
}
logout () {
    var _this = this;
    this.storage.clear().then(function () {
        _this.app.getRootNav().setRoot('LoginPage');
    });
};
wallet () {
    this.navCtrl.push('WalletPage', { section: 'deposit' });
};
history () {
    this.navCtrl.push('WalletPage', { section: 'history' });
};
account () {
    this.navCtrl.push('AccountPage');
};
notification () {
    this.navCtrl.push('NotificationPage');
};
add_address(){
    this.navCtrl.push('AddAddressPage');
};
all_address(){
    this.navCtrl.push('AllAddressPage');
    
}
privacy () {
    var browser = this.iab.create('http://swasthyashoppe.com/home/legal/privacy_policy');
    browser.show();
};
about () {
    var browser2 = this.iab.create('http://swasthyashoppe.com/home/page/About');
    browser2.show();
};
contact() {
    this.navCtrl.push("ContactPage");
  }

}
