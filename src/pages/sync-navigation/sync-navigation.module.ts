import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SyncNavigationPage } from './sync-navigation';

@NgModule({
  declarations: [
    SyncNavigationPage,
  ],
  imports: [
    IonicPageModule.forChild(SyncNavigationPage),
  ],
  exports: [
    SyncNavigationPage
  ]
})
export class SyncNavigationPageModule {}
