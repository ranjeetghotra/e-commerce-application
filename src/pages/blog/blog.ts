import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';

/**
 * Generated class for the BlogPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-blog',
  templateUrl: 'blog.html',
})
export class BlogPage {

  blogs:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public http:HttpClient,
    public loadingCtrl:LoadingController) {
    var _this = this;
    this.navCtrl = navCtrl;
    this.navParams = navParams;
    this.http = http;
    this.loadingCtrl = loadingCtrl;
    var loading = this.loadingCtrl.create({
        content: 'Please wait...'
    });
    loading.present();
    this.http.get('http://43.225.52.47/~swasthyashoppe/api/blog.php').subscribe(function (data) {
        console.log(data);
        _this.blogs = data;
        loading.dismiss();
    });
}
ionViewDidLoad() {
    console.log('ionViewDidLoad BlogPage');
}
detail(title, desc, image) {
    this.navCtrl.push('BlogDetailPage', { title: title, desc: desc, image: image });
}

}
