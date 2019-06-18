import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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

 
  ionViewDidLoad() {
    console.log('ionViewDidLoad BlogDetailPage');
  }
  title:any;
  desc:any;
  image:any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.navCtrl = navCtrl;
    this.navParams = navParams;
    this.title = navParams.get('title');
    this.desc = navParams.get('desc');
    this.image = navParams.get('image');
} 
}
