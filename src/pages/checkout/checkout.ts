import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Events, ActionSheetController, ToastController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { FormBuilder, Validators } from '@angular/forms';
import { InAppBrowser } from '@ionic-native/in-app-browser';

/**
 * Generated class for the CheckoutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-checkout',
  templateUrl: 'checkout.html',
})
export class CheckoutPage {
  showGrand: any;
  shownGroup: any;
  couponRemove: any;
  presentCoupon: any;
  couponError: any;
  couponSuccess: any;
  grand: any;
  shipping: any;
  couponForm: any; shippingForm: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public http: HttpClient,
    public storage: Storage,
    public loadingCtrl: LoadingController,
    public events: Events,
    public actionSheetCtrl: ActionSheetController,
    public formbuilder: FormBuilder,
    public toastCtrl: ToastController,
    public iab: InAppBrowser) {
    this.navCtrl = navCtrl;
    this.navParams = navParams;
    this.http = http;
    this.storage = storage;
    this.loadingCtrl = loadingCtrl;
    this.events = events;
    this.actionSheetCtrl = actionSheetCtrl;
    this.formbuilder = formbuilder;
    this.toastCtrl = toastCtrl;
    this.iab = iab;
    this.showGrand = false;
    this.shownGroup = null;
    this.couponRemove = false;
    this.presentCoupon = "";
    this.couponError = false;
    this.couponSuccess = false;
    this.grand = this.navParams.get('total');
    this.shipping = this.navParams.get('shipping');
    this.couponForm = formbuilder.group({
      coupon: ['', [Validators.required, Validators.minLength(1)]]
    });
    this.shippingForm = formbuilder.group({
      address1: ['', [Validators.required, Validators.minLength(3)]],
      address2: ['', Validators.minLength(3)],
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],
      zip: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }
  status: any;
  cart: any;
  name: any;
  email: any;
  contact: any;
  checksum: any;
  address1: any;
  address2: any;
  city: any;
  state: any;
  country: any;
  zip: any;

  ionViewDidEnter() {
    var _this = this;
    this.storage.get('USER_KEY').then(function (val) {
      var loading = _this.loadingCtrl.create({
        content: 'Please wait...'
      });
      loading.present();
      _this.storage.get('COUPON').then(function (val2) {
        _this.http.get('http://43.225.52.47/~swasthyashoppe/api/cart.php?uid=' + val + '&coupon=' + val2).subscribe(function (data) {
          console.log(data);
          _this.status = data[0]['status'];
          _this.grand = data[0]['grand'];
          _this.shipping = data[0]['shipping'];
          _this.showGrand = true;
          _this.cart = data[0]['products'];
          _this.name = data[0]['name'];
          _this.email = data[0]['email'];
          _this.contact = data[0]['contact'];
          _this.checksum = data[0]['checksum'];
          _this.address1 = data[0]['address']['address1'];
          _this.address2 = data[0]['address']['address2'];
          _this.city = data[0]['address']['city'];
          _this.state = data[0]['address']['state'];
          _this.country = data[0]['address']['country'];
          _this.zip = data[0]['address']['zip'];
          loading.dismiss();
          // check coupon response
          if (data[0]['coupon_set'] == 'yes') {
            if (data[0]['coupon_legal'] == 'yes') {
              _this.couponSuccess = true;
              _this.couponError = false;
            }
            else {
              _this.couponSuccess = false;
              _this.couponError = true;
            }
          }
          if (!val2) {
            console.log(val2);
            _this.couponRemove = false;
          }
          else {
            _this.couponRemove = true;
            console.log(val2);
            _this.presentCoupon = val2;
          }
        });
      }, function (error) {
        console.log(error);
        console.log('not set');
      });
    });
  };
  prepaid: boolean = false;
  postpaid: boolean = false;
  zipCodeChanged_2() {
    // http://swasthyashoppe.com/home/pincode_check/135001
    var _this = this;
    var loading = _this.loadingCtrl.create({
      content: 'Please, wait while we process your request..!!'
    });
    loading.present();
    _this.http.get('http://swasthyashoppe.com/home/pincode_check/' + _this.zip).subscribe(function (data) {
      _this.shipping = data['cost'];
      _this.grand = parseFloat(_this.grand) + parseFloat(_this.shipping);
      loading.dismiss();
      if (data['prepaid'] == 0) {
        if (data['postpaid'] == 0) {

          var temp = _this.toastCtrl.create({
            message: 'A Shipping cost of ₹ ' + _this.shipping + ' is applicable on this pincode. Unfortunately, prepaid & postpaid options are not available on this pincode.',
            duration: 3000,
            position: 'bottom',
            showCloseButton: true
          });
          temp.present();
          _this.postpaid = false;
        }
        else {
          var temp = _this.toastCtrl.create({
            message: 'A Shipping cost of ₹ ' + _this.shipping + ' is applicable on this pincode. Unfortunately, prepaid options are not available on this pincode.',
            duration: 3000,
            position: 'bottom',
            showCloseButton: true
          });
          temp.present();
          _this.postpaid = true;

        }
      }
      else {
        _this.prepaid = true;
        if (data['postpaid'] == 0) {

          var temp = _this.toastCtrl.create({
            message: 'A Shipping cost of ₹ ' + _this.shipping + ' is applicable on this pincode. Unfortunately, postpaid options are not available on this pincode.',
            duration: 3000,
            position: 'bottom',
            showCloseButton: true
          });
          temp.present();
          _this.postpaid = false;
        }
        else {

          var temp = _this.toastCtrl.create({
            message: 'A Shipping cost of ₹ ' + _this.shipping + ' is applicable on this pincode. ',
            duration: 3000,
            position: 'bottom',
            showCloseButton: true
          });
          temp.present();
          _this.postpaid = true;

        }
      }

    });
  }
  zipCodeChanged(xd) {
    // http://swasthyashoppe.com/home/pincode_check/135001
    var _this = this;
    var loading = _this.loadingCtrl.create({
      content: 'Please, wait while we process your request..!!'
    });
    loading.present();
    _this.http.get('http://swasthyashoppe.com/home/pincode_check/' + xd.target.value).subscribe(function (data) {
      _this.shipping = data['cost'];
      _this.grand = parseFloat(_this.grand) + parseFloat(_this.shipping);
      loading.dismiss();
      if (data['prepaid'] == 0) {
        if (data['postpaid'] == 0) {

          var temp = _this.toastCtrl.create({
            message: 'A Shipping cost of ₹ ' + _this.shipping + ' is applicable on this pincode. Unfortunately, prepaid & postpaid options are not available on this pincode.',
            duration: 3000,
            position: 'bottom',
            showCloseButton: true
          });
          temp.present();
          _this.postpaid = false;
        }
        else {
          var temp = _this.toastCtrl.create({
            message: 'A Shipping cost of ₹ ' + _this.shipping + ' is applicable on this pincode. Unfortunately, prepaid options are not available on this pincode.',
            duration: 3000,
            position: 'bottom',
            showCloseButton: true
          });
          temp.present();
          _this.postpaid = true;

        }
      }
      else {
        _this.prepaid = true;
        if (data['postpaid'] == 0) {

          var temp = _this.toastCtrl.create({
            message: 'A Shipping cost of ₹ ' + _this.shipping + ' is applicable on this pincode. Unfortunately, postpaid options are not available on this pincode.',
            duration: 3000,
            position: 'bottom',
            showCloseButton: true
          });
          temp.present();
          _this.postpaid = false;
        }
        else {

          var temp = _this.toastCtrl.create({
            message: 'A Shipping cost of ₹ ' + _this.shipping + ' is applicable on this pincode. ',
            duration: 3000,
            position: 'bottom',
            showCloseButton: true
          });
          temp.present();
          _this.postpaid = true;

        }
      }

    });
  }
  list_address: any;

  pay() {
    var _this = this;
    var options = {
      description: 'Payment towards selected items',
      image: 'http://43.225.52.47/~swasthyashoppe/api/media/icon.png',
      currency: 'INR',
      key: 'rzp_test_1DP5mmOlF5G5ag',
      amount: this.grand * 100,
      name: 'Swasthya Shopee',
      prefill: {
        email: this.email,
        contact: this.contact,
        name: this.name
      },
      theme: {
        color: '#5fa62a'
      },
      modal: {
        ondismiss: function () {
          alert('dismissed');
        }
      }
    };
    var successCallback = function (payment_id) {
      _this.checkout('razorpay', payment_id);
    };
    var cancelCallback = function (error) {
      alert(error.description + ' (Error ' + error.code + ')');
    };
    RazorpayCheckout.open(options, successCallback, cancelCallback);

  };
  choosenAddres:any;
  chooseAddress(){
    var that = this;
    var loading = that.loadingCtrl.create({content: 'Loading information, Please be patient.'})
    that.storage.get('USER_KEY').then(function (val) {
      that.http.get('http://www.swasthyashoppe.com/api/addToAddress.php?action=select_all&userid=' + val).subscribe(function (data) {
        that.list_address = data;

        
        let buttosn = [];
        that.list_address.forEach(element => {
          buttosn.push({
            text: element.firstname + ' ' + element.lastname + ', ' + element.address1 + ', ' +
                  element.address2 + ',' + element.state + '-'+ element.zip,
            role: element.address_id,
            handler: () => {
              that.choosenAddres=element;
              console.log(element);
              that.address1 = element.address1;
              that.address2 = element.address2;
              that.state = element.state;
              that.zip = element.zip;
              that.city = element.city; 
              that.country = element.country; 
              //that.zipCodeChanged(element);
              that.zipCodeChanged_2();
            }
          } );
        });

        let actionSheet = that.actionSheetCtrl.create({
          title: 'Choose an address',
          buttons:buttosn
        });

        loading.dismiss();
        actionSheet.present();
      });
    });
  }
  presentActionSheet() {
    var _this = this;
    let buttons: any;
    if (_this.prepaid == false) {
      if(_this.postpaid)
      {
        buttons = [
           
          {
            text: 'Cash on Delivery',
            icon: 'cash',
            handler: function () {
              //this.pay();
              _this.checkout('cash_on_delivery', '');
            }
          },
          {
            text: 'Cancel',
            role: 'cancel',
            icon: 'close-circle' 
          }
        ]
      }
      else{
        buttons = [ 
          {
            text: 'Cancel',
            role: 'cancel',
            icon: 'close-circle' 
          }
        ]
      }
      
    }
    else {
      if(_this.postpaid)
      {
        buttons = [
          {
            text: 'Pay via RazorPay',
            icon: 'cash',
            handler: function () {
              _this.pay();
            }
          }//, {
           // text: 'Pay Via Wallet',
           // icon: 'cash',
           // handler: function () {
              // this.pay();
           // }
          //}
          ,
          {
            text: 'Cash on Delivery',
            icon: 'cash',
            handler: function () {
              //this.pay();
              _this.checkout('cash_on_delivery', '');
            }
          },
          {
            text: 'Cancel',
            role: 'cancel',
            icon: 'close-circle' 
          }
        ]
      }
      else{
        buttons = [
          {
            text: 'Pay via RazorPay',
            icon: 'cash',
            handler: function () {
              _this.pay();
            }
          }/*, {
            text: 'Pay Via Wallet',
            icon: 'cash',
            handler: function () {
               this.pay();
            }
          }*/, 
          {
            text: 'Cancel',
            role: 'cancel',
            icon: 'close-circle' 
          }
        ]
      }
      
    }
    var actionSheet = this.actionSheetCtrl.create({
      title: 'Choose a payment method',
      buttons: buttons
    });
    actionSheet.present();
  };
  toggleGroup(group) {
    if (this.isGroupShown(group)) {
      this.shownGroup = null;
    }
    else {
      this.shownGroup = group;
    }
  };
  isGroupShown(group) {
    return this.shownGroup === group;
  };
  applyCoupon() {
    var _this = this;
    console.log('yo');
    this.storage.set('COUPON', this.couponForm.get('coupon').value).then(function () {
      _this.couponRemove = true;
      _this.presentCoupon = _this.couponForm.get('coupon').value;
      _this.ionViewDidEnter();
    });
  };
  removeCoupon() {
    var _this = this;
    this.storage.remove('COUPON').then(function () {
      _this.couponRemove = false;
      _this.presentCoupon = '';
      _this.ionViewDidEnter();
    });
  };
  checkout(type, payment_id) {
    var _this = this;
    this.storage.get('USER_KEY').then(function (val) {
      var loading = _this.loadingCtrl.create({
        content: 'Please wait...'
      });
      loading.present();
      _this.storage.get('COUPON').then(function (val2) {
        _this.http.get('http://43.225.52.47/~swasthyashoppe/api/checkout.php?uid=' + val + '&coupon=' + val2 + '&type=' + type + '&add1=' + _this.shippingForm.get('address1').value + '&add2=' + _this.shippingForm.get('address2').value + '&city=' + _this.shippingForm.get('city') + '&state=' + _this.shippingForm.get('state') + '&country=' + _this.shippingForm.get('country') + '&zip=' + _this.shippingForm.get('zip').value + '&payment_id=' + payment_id).subscribe(function (data) {
          console.log(data);
          _this.status = data['status'];
          if (_this.status == 'OK') {
            var toast = _this.toastCtrl.create({
              message: data['msg'],
              duration: 3000,
              position: 'bottom',
              showCloseButton: true
            });
            toast.present();
            _this.events.publish('cart:set', 0, Date.now());
            //this.navCtrl.pop();
            var currentIndex_1 = _this.navCtrl.getActive().index;
            _this.navCtrl.push('SuccessPage', { order: data['sale_code'] }).then(function () {
              _this.navCtrl.remove(currentIndex_1);
            });
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
          loading.dismiss();
        });
      }, function (error) {
        console.log(error);
        console.log('not set');
      });
    });
  };
  ionViewDidLoad() {
    console.log('ionViewDidLoad CheckoutPage');
  }

}
