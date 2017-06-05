import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CakeCreatorPage } from './cake-creator';

@NgModule({
  declarations: [
    CakeCreatorPage,
  ],
  imports: [
    IonicPageModule.forChild(CakeCreatorPage),
  ],
  exports: [
    CakeCreatorPage
  ]
})
export class CakeCreatorPageModule {}
