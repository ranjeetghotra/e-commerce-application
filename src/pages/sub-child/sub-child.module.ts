import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SubChildPage } from './sub-child';

@NgModule({
  declarations: [
    SubChildPage,
  ],
  imports: [
    IonicPageModule.forChild(SubChildPage),
  ],
})
export class SubChildPageModule {}
