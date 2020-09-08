import { Component, ViewChild } from "@angular/core";
import { Platform, MenuController } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";

import { TabsPage } from "../pages/tabs/tabs";
import { Storage } from "@ionic/storage";
import { Events } from "ionic-angular";
import { IonicPage, NavController, Nav, NavParams } from "ionic-angular";
import { HttpClient } from "@angular/common/http";
import { HomePage } from "../pages/home/home";
import { Push, PushObject, PushOptions } from "@ionic-native/push";
@Component({
  templateUrl: "app.html"
})
export class MyApp {
  rootPage: any = TabsPage;
  cats: any;
  wallet_balance: number = 0;
  customer_name: string;
  fcmId: string='';
  @ViewChild(Nav) nav: Nav;
  constructor(
    private http: HttpClient,
    private platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private storage: Storage,
    private push: Push,
    public events: Events,
    public menuCtrl: MenuController
  ) {
    var _this = this;
    this.http = http;
    this.storage = storage;
    //this.push = push;
    platform.ready().then(function() {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      _this.statusBar.backgroundColorByHexString("#66af2e");
      _this.statusBar.styleLightContent();
      splashScreen.hide();
      _this.storage.get("USER_KEY").then(function(val) {
        console.log(val);
        console.log("comp");
        //      _this.pushsetup();
        if (val === null) {
          _this.rootPage = "LoginPage";
        } else {
          _this.rootPage = TabsPage;
        }
      });
      _this.http
        .get("http://swasthyashoppe.com/api/sideMenuCats.php")
        .subscribe(function(data2) {
          console.log(data2);
          _this.cats = data2;
          console.log(_this.cats[0]);
        });
    });

    _this.storage.get("USER_KEY").then(function(val) {
      _this.http
        .get("http://swasthyashoppe.com/api/wallet.php?uid=" + val)
        .subscribe(function(data) {
          // _this.wallet_balance = data['balance'];
          // _this.customer_name = data['name'];
          _this.events.publish("wallet_balanced", data["balance"], Date.now());
          _this.events.publish("customer_name", data["name"], Date.now());
          console.log(data);
        });
    });
    events.subscribe("wallet_balanced", balance => {
      _this.wallet_balance = balance;
    });
    events.subscribe("customer_name", name => {
      _this.customer_name = name;
    });
    _this.push.hasPermission().then((res: any) => {
      if (res.isEnabled) {
        console.log("We have permission to send push notifications");
        _this.push
          .createChannel({
            id: "849291731439",
            description: "My first test channel",
            // The importance property goes from 1 = Lowest, 2 = Low, 3 = Normal, 4 = High and 5 = Highest.
            importance: 3
          })
          .then(() => console.log("Channel created"));
        const options: PushOptions = {
          android: {},
          ios: {
            alert: "true",
            badge: true,
            sound: "false"
          },
          windows: {},
          browser: {
            pushServiceURL: "http://push.api.phonegap.com/v1/push"
          }
        };
        const pushObject: PushObject = _this.push.init(options);

        pushObject
          .on("notification")
          .subscribe((notification: any) =>
            console.log("Received a notification", notification)
          );

        pushObject.on("registration").subscribe((registration: any) => {
          _this.fcmId = registration.registrationId;
          console.log("Device registered", registration);
          console.log(registration.registrationId);
          _this.storage.get("USER_KEY").then(function(val) {
            if(_this.fcmId != ''){
            _this.http
              .get("http://swasthyashoppe.com/api/fcm.php?uid=" + val +'&rid='+_this.fcmId)
              .subscribe(function(data) { console.log('id updated') });
          }
          });
          pushObject.subscribe("swasthya").then((res: any) => {
            console.log("subscribed to topic: ", res);
          });
        });
        pushObject
          .on("error")
          .subscribe(error => console.error("Error with Push plugin", error));
      } else {
        console.log("We do not have permission to send push notifications");
      }
    });
  }
  openSub_child_CategoryPage() {
    console.log("hi");
  }
  selectedMenu2: any;
  selectedMenu: any;
  openPage(page, index) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if (page.component) {
      //this.navCtrl.setRoot(page.component);
      //this.menuCtrl.close();
    } else {
      if (this.selectedMenu) {
        this.selectedMenu = 0;
      } else {
        this.selectedMenu = index;
      }
    }
    console.log(page + "page");
  }
  openPage2(page, index2) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if (page.component) {
      //this.navCtrl.setRoot(page.component);
      //this.menuCtrl.close();
    } else {
      if (this.selectedMenu2) {
        this.selectedMenu2 = 0;
      } else {
        this.selectedMenu2 = index2;
      }
    }
    console.log(page + "page2");
    console.log(index2);
  }
  cat(id, name) {
    console.log(id);
    this.nav.push("CatPage", { id: id, name: name });
    this.menuCtrl.close();
    //this.nav.push(HomePage, { id: id, name: name });
  }
  sub(id, name) {
    this.nav.push("SubCatPage", { id: id, name: name });
    this.menuCtrl.close();
  }
  child(id, name) {
    this.nav.push("subChildPage", { id: id, name: name });
    this.menuCtrl.close();
  }
  blog() {
    this.nav.push("BlogPage");
    this.menuCtrl.close();
  }
  wallet() {
    this.nav.push("WalletPage");
    this.menuCtrl.close();
  }
  account() {
    this.nav.push("SettingPage");
    this.menuCtrl.close();
  }
  contact() {
    this.nav.push("ContactPage");
    this.menuCtrl.close();
  }
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
