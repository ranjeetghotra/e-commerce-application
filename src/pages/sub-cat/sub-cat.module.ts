import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SubCatPage } from './sub-cat';

@NgModule({
  declarations: [
    SubCatPage,
  ],
  imports: [
    IonicPageModule.forChild(SubCatPage),
  ],
})
export class SubCatPageModule {}
