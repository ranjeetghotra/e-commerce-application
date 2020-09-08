import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

/**
 * Generated class for the ContactPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html',
})
export class ContactPage {
  userData: any;
  contactForm: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private formbuilder : FormBuilder,
    public http: HttpClient,  public toastCtrl: ToastController) {
    this.formbuilder = formbuilder;
    this.userData = { "provider": "web","type": "","name":"", "phone": "", "email": "", "subject": "", "message": ""};
    this.contactForm = formbuilder.group({
      type: ['', Validators.required],
      name: ['', Validators.required],
      phone: ['', [Validators.required,Validators.minLength(10)]],
      email: ['', [Validators.required,Validators.pattern(".+\@.+\..+")]],
      subject: ['', Validators.required],
      message: ['', [Validators.required]]
  });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactPage');
  }

  contact() {
    var _this = this;
    //Get email address and password and validate
    if (_this.contactForm.valid) {
        //this.registerForm.get('email').value;
        this.http.get('http://swasthyashoppe.com/api/contact.php?type='+_this.contactForm.get('type').value+'&name=' + _this.contactForm.get('name').value+ '&phone=' + this.contactForm.get('phone').value +'&email=' + _this.contactForm.get('email').value+ '&subject=' + this.contactForm.get('subject').value + '&message=' + this.contactForm.get('message').value ).subscribe(function (data) {
            console.log(data);
           if (data['status'] == true) {
                var toast = _this.toastCtrl.create({
                    message: data['message'],
                    duration: 3000,
                    position: 'bottom'
                });
                toast.present();
                _this.navCtrl.pop();
            }
            else {
                var toast = _this.toastCtrl.create({
                    message: data['message'],
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

}
