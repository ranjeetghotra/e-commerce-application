import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RevQaPage } from './rev-qa';

import { StarRatingModule, StarRating } from 'ionic3-star-rating';
@NgModule({
  declarations: [
    RevQaPage,
  ],
  imports: [
    StarRatingModule,
    IonicPageModule.forChild(RevQaPage),
  ],
})
export class RevQaPageModule {}
