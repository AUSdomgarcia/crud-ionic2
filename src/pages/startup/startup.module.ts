import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StartupPage } from './startup';

@NgModule({
  declarations: [
    StartupPage,
  ],
  imports: [
    IonicPageModule.forChild(StartupPage),
  ],
  exports: [
    StartupPage
  ]
})
export class StartupPageModule {}
