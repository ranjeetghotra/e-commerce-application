import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';

/**
 * Generated class for the AllBrandsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-all-brands',
  templateUrl: 'all-brands.html',
})
export class AllBrandsPage {
  brands:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpClient) {
   
    var _this = this;
    this.navCtrl = navCtrl;
    this.navParams = navParams;
    this.http = http;
    this.http.get('http://swasthyashoppe.com/api/brands.php?action=all').subscribe(function (data2) {
        console.log(data2);
        _this.brands = data2;
    });
}
brand(id) {
    this.navCtrl.push('BrandsPage', { id: id });
};
  ionViewDidLoad() {
    console.log('ionViewDidLoad AllBrandsPage');
  }

}
