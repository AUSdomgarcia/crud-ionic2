import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CakesHomePage } from './cakes-home';

@NgModule({
  declarations: [
    CakesHomePage,
  ],
  imports: [
    IonicPageModule.forChild(CakesHomePage),
  ],
  exports: [
    CakesHomePage
  ]
})
export class CakesHomePageModule {}
