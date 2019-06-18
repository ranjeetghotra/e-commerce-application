import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the SuccessPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-success',
  templateUrl: 'success.html',
})
export class SuccessPage {
  orderid:any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.orderid = this.navParams.get('order');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SuccessPage');
  }

}
