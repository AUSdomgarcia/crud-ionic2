import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SyncCmsPage } from './sync-cms';

@NgModule({
  declarations: [
    SyncCmsPage,
  ],
  imports: [
    IonicPageModule.forChild(SyncCmsPage),
  ],
  exports: [
    SyncCmsPage
  ]
})
export class SyncCmsPageModule {}
