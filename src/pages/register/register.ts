import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
userData:any;
registerForm:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private formbuilder : FormBuilder,
    public http: HttpClient, public storage: Storage, public toastCtrl: ToastController
    ) {
    this.navCtrl = navCtrl;
    this.formbuilder = formbuilder;
    this.http = http;
    this.storage = storage;
    this.toastCtrl = toastCtrl;
    this.userData = { "provider": "web", "email": "", "password": "", "name": "", "type": "", "phone": "" };
    this.registerForm = formbuilder.group({
        email: ['', Validators.required,Validators.pattern(".+\@.+\..+")],
        password: ['', Validators.required,Validators.minLength(2)],
        name: ['', Validators.required,Validators.minLength(3)],
        type: ['', Validators.required],
        phone: ['', Validators.required,Validators.minLength(10)]
    });
    storage.get('USER_KEY').then(function (val) {
        console.log('User Key is', val);
    });
   }
   
   Validators() {
    var _this = this;
    //Get email address and password and validate
    if (this.registerForm.valid) {
        console.log(this.registerForm.get('email').value);
        console.log(this.registerForm.get('password').value);
        //this.registerForm.get('email').value;
        this.http.get('http://swasthyashoppe.com/api/register.php?username=' + this.registerForm.get('email').value + '&password=' + this.registerForm.get('password').value + '&name=' + this.registerForm.get('name').value + '&type=' + this.registerForm.get('type').value + '&phone=' + this.registerForm.get('phone').value).subscribe(function (data) {
            console.log(data);
            if (data['status'] == 'OK') {
                _this.storage.set('USER_KEY', data['USER_KEY']).then(function () {
                    _this.navCtrl.setRoot('TabsPage');
                });
            }
            else {
                var toast = _this.toastCtrl.create({
                    message: data['status'],
                    duration: 3000,
                    position: 'bottom'
                });
                toast.present();
            }
        });
    }
    else {
        console.log('Invalid credential');
    }
};
loginBack() {
    this.navCtrl.pop();
};
}
