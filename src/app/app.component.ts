import { Component, ViewChild } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { Storage } from '@ionic/storage';

import { IonicPage, NavController, Nav, NavParams } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { HomePage } from '../pages/home/home';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    rootPage: any = TabsPage;
    cats: any;
    @ViewChild(Nav) nav: Nav;
    constructor(
        private http: HttpClient,
        private platform: Platform, private statusBar: StatusBar, private splashScreen: SplashScreen, private storage: Storage, private push: Push) {
        var _this = this;
        this.http = http;
        this.storage = storage;
        //this.push = push;
        platform.ready().then(function () {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            _this.statusBar.backgroundColorByHexString('#66af2e');
            _this.statusBar.styleLightContent();
            splashScreen.hide();
            _this.storage.get('USER_KEY').then(function (val) {
                console.log(val);
                console.log('comp');
                //      _this.pushsetup();
                if (val === null) {
                    _this.rootPage = 'LoginPage';
                }
                else {
                    _this.rootPage = TabsPage;
                }
            });
            _this.http.get('http://43.225.52.47/~swasthyashoppe/api/sideMenuCats.php').subscribe(function (data2) {
                console.log(data2);
                _this.cats = data2;
                console.log(_this.cats[0]);
            });
        });
        _this.push.hasPermission()
            .then((res: any) => {

                if (res.isEnabled) {
                    console.log('We have permission to send push notifications');
                } else {
                    console.log('We do not have permission to send push notifications');
                }

            });
        _this.push.createChannel({
            id: "517261210021",
            description: "My first test channel",
            // The importance property goes from 1 = Lowest, 2 = Low, 3 = Normal, 4 = High and 5 = Highest.
            importance: 3
        }).then(() => console.log('Channel created'));
        const options: PushOptions = {
            android: {},
            ios: {
                alert: 'true',
                badge: true,
                sound: 'false'
            },
            windows: {},
            browser: {
                pushServiceURL: 'http://push.api.phonegap.com/v1/push'
            }
        };

        const pushObject: PushObject = this.push.init(options);
        pushObject.on('notification').subscribe((notification: any) => console.log('Received a notification', notification));

        pushObject.on('registration').subscribe((registration: any) => console.log('Device registered', registration));

        pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));

    }
    openSub_child_CategoryPage() {
        console.log("hi");
    };
    selectedMenu2: any; selectedMenu: any;
    openPage(page, index) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        if (page.component) {
            //this.navCtrl.setRoot(page.component);
            //this.menuCtrl.close();
        }
        else {
            if (this.selectedMenu) {
                this.selectedMenu = 0;
            }
            else {
                this.selectedMenu = index;
            }
        }
        console.log(page + "page");
    };
    openPage2(page, index2) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        if (page.component) {
            //this.navCtrl.setRoot(page.component);
            //this.menuCtrl.close();
        }
        else {
            if (this.selectedMenu2) {
                this.selectedMenu2 = 0;
            }
            else {
                this.selectedMenu2 = index2;
            }
        }
        console.log(page + "page2");
        console.log(index2);
    };
    cat(id, name) {
        console.log(id);
        this.nav.push('CatPage', { id: id, name: name });
        this.nav.push(HomePage, { id: id, name: name });
    };
    sub(id, name) {
        this.nav.push('SubCatPage', { id: id, name: name });
    };
    child(id, name) {
        this.nav.push('subChildPage', { id: id, name: name });
    };
    blog() {
        this.nav.push('BlogPage');
    };
    wallet() {
        this.nav.push('WalletPage');
    };
    account() {
        this.nav.push('SettingPage');
    };
    /*pushsetup() {
      var _this = this;
      var options = {
          android: {
              senderID: '1972087821'
          },
          ios: {
              alert: 'true',
              badge: true,
              sound: 'false'
          },
          windows: {},
          browser: {}
      };
      var pushObject = this.push.init(options);
      pushObject.on('notification').subscribe(function (notification) { return console.log(notification); });
      pushObject.on('registration').subscribe(function (registration) {
          _this.storage.set('DEVICE_TOKEN', registration.registrationId);
      });
  }*/
}
