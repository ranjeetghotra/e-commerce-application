import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Events } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player';
import { SocialSharing } from '@ionic-native/social-sharing';
import { StarRatingModule } from 'ionic3-star-rating';

/**
 * Generated class for the ProductPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-product',
  templateUrl: 'product.html',
})
export class ProductPage {
 bulk_status:any;
 
 qa_status:any;
 rv_status :any;
 bl_status :any;
 youtubeId :any;
 title :any;
 image :any; 
 price :any;
 shownGroup :any;
 id :any;   
 short_desc :any; 
 stock :any;
 bulk:any;rv:any;
 rv_a:any;
 rv_q:any;
 qa:any;
 zipCode:string='';
 shipCost:number=0;
 shipTime:string="";
 zipmsg:string="";
 isZipSet:boolean=false;
 isvarient:boolean=false;
 producturl:string;
 varient:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public http:HttpClient,
    public storage:Storage, 
    public toastCtrl:ToastController,
    public events:Events,public youtube:YoutubeVideoPlayer,public socialSharing:SocialSharing) {
    var _this = this;
    this.navCtrl = navCtrl;
    this.navParams = navParams;
    this.http = http;
    this.storage = storage;
    this.toastCtrl = toastCtrl;
    this.events = events;
    this.youtube = youtube;
    this.socialSharing = socialSharing;
    this.bulk_status = false;
    this.qa_status = false;
    this.rv_status = false;
    this.bl_status = false;
    this.youtubeId = '';
    this.title = '';
    this.image = '';
    this.short_desc = '';
    this.producturl = ''
    this.price = '';
    this.shownGroup = null;
    this.id = this.navParams.get('id');
    this.youtubeId = this.navParams.get('video');
    this.title = this.navParams.get('name');
    this.image = this.navParams.get('image');
    this.short_desc = this.navParams.get('short_desc');
    this.price = this.navParams.get('price');
    this.stock = this.navParams.get('stock');
    //console.log(this.navParams.get('name'));
    //console.log(this.navParams.get('image'));
    this.http.get('http://swasthyashoppe.com/api/product_detail.php?pid=' + this.id).subscribe(function (data) {
        console.log(data);
        console.log('product_fethed');
        _this.producturl = data[0]['url'];
        if (data[0]['bulk_applicable'] == 'YES') {
            _this.bulk_status = true;
            _this.bulk = data[0]['plans'];
            //console.log(this.bulk);
        }
        if (data[0]['qa_applicable'] == 'YES') {
            _this.qa_status = true;
            _this.qa = data[0]['content'];
            //console.log(this.qa);
        }
        if (data[0]['rv_applicable'] == 'YES') {
            _this.rv_status = true;
            _this.rv = data[0]['rv_content'];
            _this.rv_q = data[0]['rv_content'][0]['questions'];
            _this.rv_a = data[0]['rv_content'][0]['answers'];
            //console.log(this.rv_q);
            //console.log(this.rv);
        }
        if (data[0]['bl_applicable'] == 'YES') {
            _this.bl_status = true;
            _this.bl = data[0]['bl_content'];
            //console.log(this.rv_q);
            //console.log(this.rv);
        }
        if (data[0]['isvarients'] == 'YES') {
            console.log("oo");
            _this.isvarient = true;
            _this.varient = data[0]['varients'];
        }
        _this.detail = data[0]['product_detail'];
    });
    this.http.get('http://swasthyashoppe.com/api/products.php?cat=1').subscribe(function (data) {
        //console.log(data);
        _this.prods = data;
    });
}
bl:any;
detail:any;
prods:any;
ionViewDidLoad() {
    console.log('ionViewDidLoad ProductPage');
};
toggleGroup(group) {
    if (this.isGroupShown(group)) {
        this.shownGroup = null;
    }
    else {
        this.shownGroup = group;
    }
};
;
isGroupShown(group) {
    return this.shownGroup === group;
};
;
addToCart(pid) {
    var _this = this;
    console.log(pid);
    this.storage.get('USER_KEY').then(function (val) {
        console.log('User Key is', val);
        _this.http.get('http://swasthyashoppe.com/api/addToCart.php?product=' + pid + '&uid=' + val).subscribe(function (data) {
            //console.log(data);
            console.log(data);
            if (data['status'] == 'OK') {
                var toast = _this.toastCtrl.create({
                    message: data['msg'],
                    duration: 3000,
                    position: 'bottom',
                    showCloseButton: true
                });
                toast.present();
                _this.events.publish('cart:added', 1, Date.now()); 
            }
            else {
                var toast = _this.toastCtrl.create({
                    message: data['msg'],
                    duration: 3000,
                    position: 'bottom',
                    showCloseButton: true
                });
                toast.present();
            }
        });
    });
};
bulkToCart(pid,qty) {
    var _this = this;
    console.log(pid);
    this.storage.get('USER_KEY').then(function (val) {
        console.log('User Key is', val);
        _this.http.get('http://swasthyashoppe.com/api/addToCart.php?product=' + pid + '&uid=' + val+ '&qty=' + qty).subscribe(function (data) {
            //console.log(data);
            console.log(data);
            if (data['status'] == 'OK') {
                var toast = _this.toastCtrl.create({
                    message: data['msg'],
                    duration: 3000,
                    position: 'bottom',
                    showCloseButton: true
                });
                toast.present();
                _this.events.publish('cart:added', qty, Date.now()); 
            }
            else {
                var toast = _this.toastCtrl.create({
                    message: data['msg'],
                    duration: 3000,
                    position: 'bottom',
                    showCloseButton: true
                });
                toast.present();
            }
        });
    });
};
addToWish(pid) {
    var _this = this;
    console.log(pid);
    this.storage.get('USER_KEY').then(function (val) {
        console.log('User Key is', val);
        _this.http.get('http://swasthyashoppe.com/api/addToWish.php?product=' + pid + '&uid=' + val).subscribe(function (data) {
            //console.log(data);
            console.log(data);
            if (data['status'] == 'OK') {
                var toast = _this.toastCtrl.create({
                    message: data['msg'],
                    duration: 3000,
                    position: 'bottom',
                    showCloseButton: true
                });
                toast.present();
            }
            else {
                var toast = _this.toastCtrl.create({
                    message: data['msg'],
                    duration: 3000,
                    position: 'bottom',
                    showCloseButton: true
                });
                toast.present();
            }
        });
    });
};
play(id) {
    console.log(id);
    this.youtube.openVideo(id);
};
share(title, image, purl) {
    //var purl = this.producturl;
    //console.log('('+purl+')');
    this.socialSharing.share(title, '', image, purl);
};
addReview(id) {
    this.navCtrl.push('RevQaPage', { section: 'review', pid: id });
};
askQuestion(id) {
    this.navCtrl.push('RevQaPage', { section: 'ask', pid: id });
};
openBlog(title, desc, image) {
    this.navCtrl.push('BlogDetailPage', { title: title, desc: desc, image: image });
};
product(id, name, image, short_desc, price, video, stock) {
    this.navCtrl.push('ProductPage', { id: id, name: name, image: image, short_desc: short_desc, price: price, video: video, stock: stock });
    //this.navCtrl.push('ProductPage', { id: id, name: name, image: image, short_desc: short_desc, price: price, video: video });
};
oye() {
    var toast = this.toastCtrl.create({
        message: 'Product is currently out of stock',
        duration: 3000,
        position: 'bottom',
        showCloseButton: true,
        closeButtonText: 'OK'
    });
    toast.present();
};
zipFetch(){
    var _this = this;
    if(_this.zipCode.length==6){
    _this.http.get('http://swasthyashoppe.com/home/pincode_check/' +_this.zipCode).subscribe(function (data) {
            //console.log(data);
            console.log(data);
            if (data['cost'] != 'null' && data['time'] != 'null') {
                _this.shipCost = data['cost'];
                _this.shipTime = data['time'];
                _this.isZipSet = true;
                _this.zipmsg = "shipping cost is "+_this.shipCost+" and deliver within "+_this.shipTime;
            }
            else {
                _this.isZipSet = false;
            }
        });
    }
    else{
        _this.isZipSet = true;
        _this.zipmsg = "enter valid zip code"
    }
}
openvarient(id, name, image, short_desc, price, video, stock){
    this.navCtrl.push('ProductPage', { id: id, name: name, image: image, short_desc: short_desc, price: price, video: video, stock: stock });
}
}
