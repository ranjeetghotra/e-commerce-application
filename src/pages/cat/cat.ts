import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, ToastController, LoadingController, Events } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';

/**
 * Generated class for the CatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cat',
  templateUrl: 'cat.html',
})
export class CatPage {
  products : any = [];
  page:any;
  column:any;
  order:any;
  searchActive:any;
  title:any;
  cats:any;
   
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public http:HttpClient,
    public actionSheetCtrl:ActionSheetController,public toastCtrl:ToastController,
    public loadingCtrl:LoadingController,public events:Events) {
    var _this = this;
    this.navCtrl = navCtrl;
    this.http = http;
    this.navParams = navParams;
    this.actionSheetCtrl = actionSheetCtrl;
    this.toastCtrl = toastCtrl;
    this.loadingCtrl = loadingCtrl;
    this.events = events;
    this.products = [];
    this.page = 10;
    this.column = 'product_id';
    this.order = 'DESC';
    this.searchActive = false;
    this.title = this.navParams.get('name');
    this.http.get('http://43.225.52.47/~swasthyashoppe/api/sub_categories.php?id=' + this.navParams.get('id')).subscribe(function (data) {
        //console.log(data);
        _this.cats = data;
    });
    this.http.get('http://43.225.52.47/~swasthyashoppe/api/products.php?cat=' + this.navParams.get('id') + '&page=' + this.page + '&column=' + this.column + '&order=' + this.order).subscribe(function (data) {
        //console.log(data);
        _this.products = data;
        _this.page = _this.page + 10;
    });
}
sub (id, name) {
    this.navCtrl.push('SubCatPage', { id: id, name: name });
};
product (id, name, image, short_desc, price, video, stock) {
    this.navCtrl.push('ProductPage', { id: id, name: name, image: image, short_desc: short_desc, price: price, video: video, stock: stock });
};
searchString:any;
doFilter (column, order) {
    var _this = this;
    this.column = column;
    this.order = order;
    this.page = 10;
    this.events.publish('infinite', 'complete', Date.now());
    var loading = this.loadingCtrl.create({
        content: 'Applying filters...'
    });
    loading.present();
    this.http.get('http://43.225.52.47/~swasthyashoppe/api/products.php?cat=' + this.navParams.get('id') + '&page=' + this.page + '&column=' + column + '&order=' + order).subscribe(function (data) {
        //console.log(data);
        _this.products = data;
        _this.page = _this.page + 10;
        loading.dismiss();
    });
};
onSearch (event) {
    var _this = this;
    console.log(this.searchString);
    this.http.get('http://43.225.52.47/~swasthyashoppe/api/products.php?cat=' + this.navParams.get('id') + '&page=10&column=product_id&order=DESC&like=' + this.searchString).subscribe(function (data) {
        //console.log(data);
        _this.products = data;
    });
};
searchbar:any;
startSearch () {
    var _this = this;
    this.searchActive = true;
    setTimeout(function () {
        _this.searchbar.setFocus();
    }, 50);
};
closeSearch () {
    this.searchActive = false;
};
filter () {
    var _this = this;
    var actionSheet = this.actionSheetCtrl.create({
        title: 'Sort By',
        buttons: [
            {
                icon: 'trending-up',
                text: 'Price Low to High',
                handler: function () {
                    _this.doFilter('sale_price', 'ASC');
                }
            }, {
                icon: 'trending-down',
                text: 'Price High to Low',
                handler: function () {
                    _this.doFilter('sale_price', 'DESC');
                }
            }, {
                icon: 'list-box',
                text: 'Oldest',
                handler: function () {
                    _this.doFilter('product_id', 'ASC');
                }
            }, {
                icon: 'list-box',
                text: 'Newest',
                handler: function () {
                    _this.doFilter('product_id', 'DESC');
                }
            }, {
                icon: 'eye',
                text: 'Most Viewed',
                handler: function () {
                    _this.doFilter('number_of_view', 'DESC');
                }
            }, {
                icon: 'close-circle',
                text: 'Cancel',
                role: 'destructive',
                handler: function () {
                    console.log('Cancel clicked');
                }
            }
        ]
    });
    actionSheet.present();
};
doInfinite (infiniteScroll) {
    var _this = this;
    this.http.get('http://43.225.52.47/~swasthyashoppe/api/products.php?cat=' + this.navParams.get('id') + '&page=' + this.page + '&column=' + this.column + '&order=' + this.order).subscribe(function (data:any) {
        console.log(data);
        var len = data.length;
        if (data.length > 0) {
            for (var i = 0; i < len; i++) {
                _this.products.push(data[i]);
            }
            _this.page = _this.page + 10;
            infiniteScroll.complete();
        }
        else {
            infiniteScroll.complete();
            infiniteScroll.enable(false);
            var toast = _this.toastCtrl.create({
                message: 'No more products to show',
                duration: 3000,
                position: 'bottom'
            });
            toast.present();
        }
    });
    this.events.subscribe('infinite', function (user, time) {
        infiniteScroll.complete();
    });
};

}
