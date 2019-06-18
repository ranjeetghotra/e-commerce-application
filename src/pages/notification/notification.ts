import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';

/**
 * Generated class for the NotificationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})
export class NotificationPage {

  notifications:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public http:HttpClient, 
    public alertCtrl:AlertController) { 
    var _this = this;
    this.navCtrl = navCtrl;
    this.navParams = navParams;
    this.http = http;
    this.alertCtrl = alertCtrl;
    this.http.get('http://swasthyashoppe.com/api/notification.php').subscribe(function (data) {
        _this.notifications = data;
    });
}
ionViewDidLoad () {
    console.log('ionViewDidLoad NotificationPage');
};
view (title, content) {
    var alert = this.alertCtrl.create({
        title: title,
        message: content,
        buttons: ['OK']
    });
    alert.present();
};
}
