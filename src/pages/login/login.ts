import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { Storage } from '@ionic/storage';
import { TabsPage } from '../tabs/tabs';
import { StatusBar } from '@ionic-native/status-bar';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  userData: any;
  loginForm: any;
  email: any;
  familyName: any;
  givenName: any;
  userId: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public formbuilder: FormBuilder
    , public http: HttpClient, public toastCtrl: ToastController, public loadingCtrl: LoadingController, private fb: Facebook, private googlePlus: GooglePlus
  ,private statusBar: StatusBar) {
    this.navCtrl = navCtrl;
    this.formbuilder = formbuilder;
    this.http = http;
    this.storage = storage;
    this.toastCtrl = toastCtrl;
    this.loadingCtrl = loadingCtrl;
    this.statusBar.backgroundColorByHexString('#ffffff');
    this.statusBar.styleDefault();
    this.userData = { "provider": "web", "email": "", "password": "" };
    this.loginForm = formbuilder.group({
      email: ['', [Validators.required, Validators.pattern(".+\@.+\..+")]],
      password: ['', [Validators.required, Validators.minLength(2)]]
    });
    storage.get('USER_KEY').then(function (val) {
      console.log('User Key is', val);
    });

  }
  reset() {
    this.navCtrl.push('PassForgotPage');
  };
  register() {
    this.navCtrl.push('RegisterPage');
  };
  login() {
    var _this = this;
    //Get email address and password and validate
    if (this.loginForm.valid) {
      var loading_1 = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      loading_1.present();
      console.log(this.loginForm.get('email').value);
      console.log(this.loginForm.get('password').value);
      //this.loginForm.get('email').value;
      this.http.get('http://43.225.52.47/~swasthyashoppe/api/login.php?username=' + this.loginForm.get('email').value + '&password=' + this.loginForm.get('password').value).subscribe(function (data) {
        console.log(data);
        if (data['status'] == 'OK') {
          _this.storage.set('USER_KEY', data['USER_KEY']).then(function () {
            var toast = _this.toastCtrl.create({
              message: data['msg'],
              duration: 3000,
              position: 'bottom',
              showCloseButton: true
            });
            toast.present();
            _this.navCtrl.setRoot(TabsPage);
          });
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
  fbAction() {
    var that = this;
    that.fb.login(['public_profile', 'email'])
      .then((res: FacebookLoginResponse) => {
        console.log(res);
        that.fb.api('me?fields=id,email,first_name,last_name', []).then(profile => {
          console.log(profile);
          that.http.get('http://43.225.52.47/~swasthyashoppe/api/login_social.php?firstname=' + profile['first_name'] + '&lastname=' + profile['last_name'] + '&id=' + profile['id'] + '&email=' + profile['email'] + '&type=facebook').subscribe(function (data) {
            console.log(data);
            if (data['status'] == 'OK') {
              that.storage.set('USER_KEY', data['USER_KEY']).then(function () {
                var toast = that.toastCtrl.create({
                  message: data['msg'],
                  duration: 3000,
                  position: 'bottom',
                  showCloseButton: true
                });
                toast.present();
                that.navCtrl.setRoot(TabsPage);
              });
              //loading_1.dismiss();
            }
            else {
              var toast = that.toastCtrl.create({
                message: data['status'],
                duration: 3000,
                position: 'bottom',
                showCloseButton: true
              });
              toast.present();
              //loading_1.dismiss();
            }
          });
        });
      })
      .catch(e => console.log('Error logging into Facebook', e));


    //this.fb.logEvent(this.fb.EVENTS.EVENT_NAME_ADDED_TO_CART);
  };
  gAction() {
    var gthis = this;
    gthis.googlePlus.login({})
      .then(res => {
        console.log(res);
        gthis.http.get('http://43.225.52.47/~swasthyashoppe/api/login_social.php?firstname=' + res.givenName + '&lastname=' + res.familyName + '&id=' + res.userId + '&email=' + res.email + '&type=google').subscribe(function (data) {
          console.log(data);
          if (data['status'] == 'OK') {
            gthis.storage.set('USER_KEY', data['USER_KEY']).then(function () {
              var toast = gthis.toastCtrl.create({
                message: data['msg'],
                duration: 3000,
                position: 'bottom',
                showCloseButton: true
              });
              toast.present();
              gthis.navCtrl.setRoot(TabsPage);
            });
            //loading_1.dismiss();
          }
          else {
            var toast = gthis.toastCtrl.create({
              message: data['status'],
              duration: 3000,
              position: 'bottom',
              showCloseButton: true
            });
            toast.present();
            //loading_1.dismiss();
          }
        });
      })
      .catch(err => console.error(err));
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

}
