import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Events, LoadingController, ActionSheetController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';

/**
 * Generated class for the SubChildPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sub-child',
  templateUrl: 'sub-child.html',
})
export class SubChildPage {
  products : any = [];
  page:any;
  column:any;
  order:any;
  searchActive:any;
  title:any;
  cats:any;
  searchString:any;
 constructor(public navCtrl: NavController, public navParams: NavParams, 
    public http:HttpClient,
    public toastCtrl:ToastController,public events:Events,public loadingCtrl:LoadingController,
    public actionSheetCtrl:ActionSheetController) {
    var _this = this;
    this.navCtrl = navCtrl;
    this.http = http;
    this.navParams = navParams;
    this.toastCtrl = toastCtrl;
    this.events = events;
    this.loadingCtrl = loadingCtrl;
    this.actionSheetCtrl = actionSheetCtrl;
    this.products = [];
    this.page = 10;
    this.column = 'product_id';
    this.order = 'DESC';
    this.searchActive = false;
    this.title = this.navParams.get('name');
    this.http.get('http://swasthyashoppe.com/api/products.php?child=' + this.navParams.get('id') + '&page=' + this.page + '&column=' + this.column + '&order=' + this.order).subscribe(function (data) {
        console.log(_this.navParams.get('id'));
        _this.products = data;
        _this.page = _this.page + 10;
    });
}
product(id, name, image, short_desc, price, video, stock) {
    this.navCtrl.push('ProductPage', { id: id, name: name, image: image, short_desc: short_desc, price: price, video: video, stock: stock });
};
doFilter(column, order) {
    var _this = this;
    this.column = column;
    this.order = order;
    this.page = 10;
    this.events.publish('infinite', 'complete', Date.now());
    var loading = this.loadingCtrl.create({
        content: 'Applying filters...'
    });
    loading.present();
    this.http.get('http://swasthyashoppe.com/api/products.php?child=' + this.navParams.get('id') + '&page=' + this.page + '&column=' + column + '&order=' + order).subscribe(function (data) {
        //console.log(data);
        _this.products = data;
        _this.page = _this.page + 10;
        loading.dismiss();
    });
};
onSearch(event) {
    var _this = this;
    console.log(this.searchString);
    this.http.get('http://swasthyashoppe.com/api/products.php?child=' + this.navParams.get('id') + '&page=10&column=product_id&order=DESC&like=' + this.searchString).subscribe(function (data) {
        //console.log(data);
        _this.products = data;
    });
};
startSearch() {
    var _this = this;
    this.searchActive = true;
    setTimeout(function () {
         
    }, 50);
};
closeSearch() {
    this.searchActive = false;
};
filter() {
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
doInfinite(infiniteScroll) {
    var _this = this;
    setTimeout(function () {
        _this.http.get('http://swasthyashoppe.com/api/products.php?child=' + _this.navParams.get('id') + '&page=' + _this.page + '&column=' + _this.column + '&order=' + _this.order).subscribe(function (data:any) {
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
    }, 500);
};
}
