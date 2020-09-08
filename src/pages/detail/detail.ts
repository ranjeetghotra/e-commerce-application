import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the DetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
})
export class DetailPage {
  oid:any;
  details:any;
            products:any;
            fname :any;
            lname:any;
            add1 :any;
            add2 :any;
            city :any;
            state :any;
            country :any;
            zip :any;
            phone :any;
            email :any;
            bfname :any;
            blname :any;
            badd1:any;
            badd2 :any;
            bcity :any;
            bstate :any;
            bcountry :any;
            bzip :any;
            bphone :any;
            bemail:any;
            grand_total :any;
            payment_status :any;
            delivery_status:any;
            payment_type :any;
            placedOn :any;
            cancelbtn:boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams,public http:HttpClient,public storage:Storage,
    private alertCtrl: AlertController) {
    this.navCtrl = navCtrl;
    this.navParams = navParams;
    this.http = http;
    this.storage = storage;
    this.oid = this.navParams.get('oid');
}
ionViewDidLoad() {
    var _this = this;
    console.log('ionViewDidLoad OrdersPage');
    this.storage.get('USER_KEY').then(function (val) {
        _this.http.get('http://swasthyashoppe.com/api/orderDetail.php?oid=' + _this.oid + '&buyer=' + val).subscribe(function (data) {
            _this.details = data;
            _this.products = data['products'];
            _this.fname = data['shipping']['firstname'];
            _this.lname = data['shipping']['lastname'];
            _this.add1 = data['shipping']['address1'];
            _this.add2 = data['shipping']['address2'];
            _this.city = data['shipping']['city'];
            _this.state = data['shipping']['state'];
            _this.country = data['shipping']['country'];
            _this.zip = data['shipping']['zip'];
            _this.phone = data['shipping']['phone'];
            _this.email = data['shipping']['email'];
            _this.bfname = data['billing']['bfirstname'];
            _this.blname = data['billing']['blastname'];
            _this.badd1 = data['billing']['baddress1'];
            _this.badd2 = data['billing']['baddress2'];
            _this.bcity = data['billing']['bcity'];
            _this.bstate = data['billing']['bstate'];
            _this.bcountry = data['billing']['bcountry'];
            _this.bzip = data['billing']['bzip'];
            _this.bphone = data['billing']['bphone'];
            _this.bemail = data['billing']['bemail'];
            _this.grand_total = data['grand_total'];
            _this.payment_status = data['payment_status'];
            _this.delivery_status = data['delivery_status'];
            _this.payment_type = data['payment_type'];
            _this.placedOn = data['placedOn'];
            _this.cancelbtn = ((data['status']!='cancel'||data['status']==''||data['status']!='delivered')?true:false);
        });
    });
};
order_cancel(){
  var that = this;
  let alert = this.alertCtrl.create({
      title: 'Confirm',
      message: 'Do you want cancel?',
      buttons: [
          {
              text: 'Cancel',
              role: 'cancel',
              handler: () => {
                  console.log('Cancel clicked');
              }
          },
          {
              text: 'Yes',
              handler: () => {
                  that.order_cancel_it();
                  console.log('Yes clicked');
              }
          }
      ]
  });
  alert.present();
}
order_cancel_it(){
  var _this = this;
  _this.http.get('http://swasthyashoppe.com/api/order_cancel.php?id=' + _this.oid).subscribe(function (data) {
    if(data['status']=='OK'){
      _this.navCtrl.parent.select(3);
    }
})
}

}
