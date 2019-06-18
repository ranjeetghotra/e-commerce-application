import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, AlertController, ToastController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the RevQaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-rev-qa',
  templateUrl: 'rev-qa.html',
})
export class RevQaPage {

  answer :any;
  rating :any;
  canSubmit  :any;
  showForm :any;
  showForm2 :any;
  title  :any;
  section  :any;
  pid  :any;
  q:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public http:HttpClient,
    public events:Events, public alertCtrl:AlertController,
    public storage:Storage,public toastCtrl:ToastController) {
    var _this = this;
    this.navCtrl = navCtrl;
    this.navParams = navParams;
    this.http = http;
    this.events = events;
    this.alertCtrl = alertCtrl;
    this.storage = storage;
    this.toastCtrl = toastCtrl;
    this.answer = [];
    this.rating = 0;
    this.canSubmit = true;
    this.showForm = false;
    this.showForm2 = false;
    this.title = '';
    this.section = this.navParams.get('section');
    this.pid = this.navParams.get('pid');
    if (this.section == 'review') {
        this.title = 'Write a Review';
        this.storage.get('USER_KEY').then(function (val) {
            _this.http.get('http://43.225.52.47/~swasthyashoppe/api/new_review.php?pid=' + _this.pid + '&uid=' + val + '&check=1').subscribe(function (data2) {
                if (data2['status'] == 'OK') {
                    _this.showForm = true;
                    _this.http.get('http://43.225.52.47/~swasthyashoppe/api/new_review.php').subscribe(function (data) {
                        _this.q = data;
                        console.log(data);
                    });
                }
                else {
                    var alert_1 = _this.alertCtrl.create({
                        title: 'Already Reviewed',
                        message: 'You have already reviewed this product',
                        buttons: [{
                                text: 'Ok',
                                handler: function () {
                                    var navTransition = alert_1.dismiss();
                                    navTransition.then(function () {
                                        _this.navCtrl.pop();
                                    });
                                    return false;
                                }
                            }]
                    });
                    alert_1.present();
                }
            });
        });
    }
    else {
        this.title = 'Ask a Question';
        this.showForm2 = true;
    }
    events.subscribe('star-rating:changed', function (starRating) {
        _this.rating = starRating;
    });
}
ionViewDidLoad() {
    console.log('ionViewDidLoad RevQaPage');
};
submit() {
    var _this = this;
    if (this.rating == 0) {
        var alert_2 = this.alertCtrl.create({
            title: 'Give a Rating!',
            message: 'Please provide a rating from 1 to 5 for the selected product',
            buttons: ['OK']
        });
        alert_2.present();
    }
    else {
        for (var i = 0; i < this.q.length; i++) {
            if (this.answer[i] && this.answer[i] !== '') {
                this.canSubmit = true;
            }
            else {
                this.canSubmit = false;
            }
        }
        console.log(this.answer);
        if (this.canSubmit) {
            this.storage.get('USER_KEY').then(function (val) {
                _this.http.get('http://43.225.52.47/~swasthyashoppe/api/new_review.php?pid=' + _this.pid + '&uid=' + val + '&rating=' + _this.rating + '&answers=' + _this.answer).subscribe(function (data) {
                    var toast = _this.toastCtrl.create({
                        message: 'Thankyou, your review have been submitted',
                        duration: 3000,
                        position: 'bottom',
                        showCloseButton: true
                    });
                    toast.present();
                    _this.navCtrl.pop();
                });
            });
        }
        else {
            var alert_3 = this.alertCtrl.create({
                title: 'Incomplete Response',
                message: 'Please provide answers to given questions',
                buttons: ['OK']
            });
            alert_3.present();
        }
    }
};
question:any;
submit2() {
    var _this = this;
    if (this.question !== '') {
        this.storage.get('USER_KEY').then(function (val) {
            _this.http.get('http://43.225.52.47/~swasthyashoppe/api/new_question.php?pid=' + _this.pid + '&uid=' + val + '&question=' + _this.question).subscribe(function (data) {
                var toast = _this.toastCtrl.create({
                    message: 'Thankyou, your question have been submitted',
                    duration: 3000,
                    position: 'bottom',
                    showCloseButton: true
                });
                toast.present();
                _this.navCtrl.pop();
            });
        });
    }
    else {
        var alert_4 = this.alertCtrl.create({
            title: 'Incomplete Response',
            message: 'Please ask a valid question',
            buttons: ['OK']
        });
        alert_4.present();
    }
};

}
