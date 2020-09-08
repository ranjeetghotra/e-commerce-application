import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { LoginPage } from '../login/login';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the PassForgotPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pass-forgot',
  templateUrl: 'pass-forgot.html',
})
export class PassForgotPage {
  userData:any;
loginForm:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public formbuilder:FormBuilder
    , public http: HttpClient, public toastCtrl : ToastController, public loadingCtrl : LoadingController,
    ) {
    this.navCtrl = navCtrl;
    this.formbuilder = formbuilder;
    this.http = http;
    this.storage = storage;
    this.toastCtrl = toastCtrl;
    this.loadingCtrl = loadingCtrl;
    this.userData = { "provider": "web", "email": "", "password": "" };
    this.loginForm = formbuilder.group({
        email: ['', [Validators.required, Validators.pattern(".+\@.+\..+")]]
    });
  }
  reset() {
    var _this = this;
    //Get email address and validate
    if (this.loginForm.valid) {
        var loading_1 = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        loading_1.present();
        console.log(this.loginForm.get('email').value);
        //this.loginForm.get('email').value;
        this.http.get('http://swasthyashoppe.com/api/pass_reset.php?user=' + this.loginForm.get('email').value).subscribe(function (data) {
            console.log(data);
            if (data['status'] == 'OK') {
                    var toast = _this.toastCtrl.create({
                        message: data['msg'],
                        duration: 3000,
                        position: 'bottom',
                        showCloseButton: true
                    });
                    toast.present();
                    _this.navCtrl.setRoot(LoginPage);
                loading_1.dismiss();
            }
            else {
                var toast = _this.toastCtrl.create({
                    message: data['status'],
                    duration: 3000,
                    position: 'bottom',
                    showCloseButton: true
                });
                toast.present();
                loading_1.dismiss();
            }
        });
    }
    else {
        console.log('Invalid credential');
    }
};

  ionViewDidLoad() {
    console.log('ionViewDidLoad PassForgotPage');
  }

}
