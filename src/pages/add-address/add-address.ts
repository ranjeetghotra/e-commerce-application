import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
/**
 * Generated class for the AddAddressPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-address',
  templateUrl: 'add-address.html',
})
export class AddAddressPage {
  addressForm: any;
  update() {
    var that = this;
    if (this.navParams.get('data') == null) {
      that.storage.get('USER_KEY').then(function (val) {
        that.http.get('http://www.swasthyashoppe.com/api/addToAddress.php?action=add&user=' + val
          + '&firstname=' + that.first_name
          + '&lastname=' + that.last_name
          + '&mobile_alt=' + that.mobile
          + '&email_alt=' + that.email
          + '&address1=' + that.address1
          + '&address2=' + that.address2
          + '&city=' + that.city
          + '&state=' + that.state
          + '&country=' + that.country
          + '&zip=' + that.zip
        ).subscribe(function (data) {
          if (data['status'] == 'OK') {
            var toast = that.toastCtrl.create({
              message: data['msg'],
              duration: 3000,
              position: 'bottom',
              showCloseButton: true
            });
            that.navCtrl.pop();
            toast.present();
          } else {
            var toast = that.toastCtrl.create({
              message: 'Enter, information correctly.',
              duration: 3000,
              position: 'bottom',
              showCloseButton: true
            });
            toast.present();

          }
        });

      });
    } else {
      that.storage.get('USER_KEY').then(function (val) {
        var temp = that.navParams.get('data');
        that.http.get('http://www.swasthyashoppe.com/api/addToAddress.php?action=UPDATE&id=' + temp.address_id
          + '&firstname=' + that.first_name
          + '&lastname=' + that.last_name
          + '&mobile_alt=' + that.mobile
          + '&email_alt=' + that.email
          + '&address1=' + that.address1
          + '&address2=' + that.address2
          + '&city=' + that.city
          + '&state=' + that.state
          + '&country=' + that.country
          + '&zip=' + that.zip
        ).subscribe(function (data) {
          if (data['status'] == 'OK') {
            var toast = that.toastCtrl.create({
              message: data['msg'],
              duration: 3000,
              position: 'bottom',
              showCloseButton: true
            });
            toast.present();
          } else {
            var toast = that.toastCtrl.create({
              message: 'Enter, information correctly.',
              duration: 3000,
              position: 'bottom',
              showCloseButton: true
            });
            toast.present();

          }
        });

      });
    }


  }

  first_name: any;
  last_name: any;
  mobile: any;
  email: any;
  address1: any;
  address2: any;
  city: any;
  state: any;
  country: any;
  zip: any;
  shippingForm: any;
  userid: any;
  title: any;
  constructor(public toastCtrl: ToastController, public navCtrl: NavController, public storage: Storage, public navParams: NavParams,
    public http: HttpClient, public formbuilder: FormBuilder) {
    if (this.navParams.get('data') == null) {
      this.title = 'Add New Address';
    }
    else {
      this.title = 'Edit Address';
      var temp = this.navParams.get('data');
      this.first_name = temp.firstname;
      this.last_name = temp.lastname;
      this.mobile = temp.mobile_alt;
      this.email = temp.email_alt;
      this.address1 = temp.address1;
      this.address2 = temp.address2;
      this.city = temp.city;
      this.state = temp.state;
      this.country = temp.country;
      this.zip = temp.zip;
      console.log(temp);
    }
    this.addressForm = formbuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      email: ['', [Validators.required, Validators.pattern(".+\@.+\..+")]],
      address1: ['', [Validators.required, Validators.minLength(3)]],
      address2: ['', [Validators.required, Validators.minLength(3)]],
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],
      zip: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddAddressPage');
  }

}
