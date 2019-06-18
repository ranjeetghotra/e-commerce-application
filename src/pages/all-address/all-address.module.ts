import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AllAddressPage } from './all-address';

@NgModule({
  declarations: [
    AllAddressPage,
  ],
  imports: [
    IonicPageModule.forChild(AllAddressPage),
  ],
})
export class AllAddressPageModule {}
