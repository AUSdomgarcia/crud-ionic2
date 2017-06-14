import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CakeNavigationPage } from './cake-navigation';

@NgModule({
  declarations: [
    CakeNavigationPage,
  ],
  imports: [
    IonicPageModule.forChild(CakeNavigationPage),
  ],
  exports: [
    CakeNavigationPage
  ]
})
export class CakeNavigationPageModule {}
