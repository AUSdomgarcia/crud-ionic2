import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserPopOverPage } from './user-pop-over';

@NgModule({
  declarations: [
    UserPopOverPage,
  ],
  imports: [
    IonicPageModule.forChild(UserPopOverPage),
  ],
  exports: [
    UserPopOverPage
  ]
})
export class UserPopOverPageModule {}
