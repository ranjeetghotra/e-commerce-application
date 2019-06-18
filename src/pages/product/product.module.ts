import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductPage } from './product';

import { StarRatingModule, StarRating } from 'ionic3-star-rating';
@NgModule({
  declarations: [
    ProductPage,
  ],
  imports: [
    StarRatingModule,
    IonicPageModule.forChild(ProductPage),
  ],
})
export class ProductPageModule {}
