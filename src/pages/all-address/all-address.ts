import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';

/**
 * Generated class for the AllAddressPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-all-address',
  templateUrl: 'all-address.html',
})
export class AllAddressPage {
  list_address: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public http: HttpClient, public loadingCtrl: LoadingController) {
    var that = this;
    var loading = that.loadingCtrl.create({ content: 'Loading, please wait..!' });
    loading.present();
    that.storage.get('USER_KEY').then(function (val) {
      that.http.get('http://www.swasthyashoppe.com/api/addToAddress.php?action=select_all&userid=' + val).subscribe(function (data) {
        that.list_address = data;
        loading.dismiss();
      });
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AllAddressPage');
  }
  takeAdd(data){
    this.navCtrl.push('AddAddressPage', { data: data });
  }
  doDelete(id) {
    var that = this;
    that.storage.get('USER_KEY').then(function (val) {
      try {
        that.http.get('http://www.swasthyashoppe.com/home/registration/delete_address?id=' + id).subscribe(function (data_1: string) {

          that.navCtrl.pop();
          that.http.get('http://www.swasthyashoppe.com/api/addToAddress.php?action=select_all&userid=' + val).subscribe(function (data) {
            that.list_address = data;
          });
        }, onerror => {  
          that.http.get('http://www.swasthyashoppe.com/api/addToAddress.php?action=select_all&userid=' + val).subscribe(function (data) {
            that.list_address = data;
          });
        });

      } catch (er) {
        that.navCtrl.pop();
        that.http.get('http://www.swasthyashoppe.com/api/addToAddress.php?action=select_all&userid=' + val).subscribe(function (data) {
          that.list_address = data;
        });
      }
    });
  }
}
