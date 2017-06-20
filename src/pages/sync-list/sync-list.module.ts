import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SyncListPage } from './sync-list';

@NgModule({
  declarations: [
    SyncListPage,
  ],
  imports: [
    IonicPageModule.forChild(SyncListPage),
  ],
  exports: [
    SyncListPage
  ]
})
export class SyncListPageModule {}
