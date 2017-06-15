import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DatasyncPage } from './datasync';

@NgModule({
  declarations: [
    DatasyncPage,
  ],
  imports: [
    IonicPageModule.forChild(DatasyncPage),
  ],
  exports: [
    DatasyncPage
  ]
})
export class DatasyncPageModule {}
