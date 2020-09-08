import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the BlogDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-blog-detail',
  templateUrl: 'blog-detail.html',
})
export class BlogDetailPage {
commentin:string='';
 
  ionViewDidLoad() {
    console.log('ionViewDidLoad BlogDetailPage');
  }
  id:any;
  title:any;
  desc:any;
  image:any;
  comments:any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpClient,
    public toastCtrl: ToastController,
    public storage: Storage) {
      var that = this;
      that.navCtrl = navCtrl;
      that.navParams = navParams;
      that.id = navParams.get('id');
      that.title = navParams.get('title');
      that.desc = navParams.get('desc');
      that.image = navParams.get('image');

    that.http.get('http://swasthyashoppe.com/api/comment.php?blog='+that.id ).subscribe(function (data) {
      that.comments = data;
});
} 
comment(){
  var that = this;
  var cmt = that.commentin;
  that.commentin = '';
  this.storage.get('USER_KEY').then(function (val) {
    that.http.get('http://swasthyashoppe.com/api/comment.php?user='+val+'&blog='+that.id+'&comment='+cmt ).subscribe(function (data) {
    console.log(data);
   if (data['status'] == true) {
        var toast = that.toastCtrl.create({
            message: 'submitted. wait for approval',
            duration: 3000,
            position: 'bottom'
        });
        toast.present();
    }
    else {
        var toast = that.toastCtrl.create({
            message: 'Comment no Submitted',
            duration: 3000,
            position: 'bottom'
        });
        toast.present();
    }
});
});
  
}
}
