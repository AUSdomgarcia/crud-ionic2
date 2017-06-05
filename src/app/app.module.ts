import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SQLite } from '@ionic-native/sqlite';

import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { HomePage } from '../pages/home/home';
import { MyApp } from './app.component';
import { UserSettings, CameraSettings } from '../shared/shared';

import { LoginPage } from '../pages/login/login';
import { UserPage } from '../pages/user/user';
import { UserDetailsPage } from '../pages/user-details/user-details';
import { UserPopOverPage } from '../pages/user-pop-over/user-pop-over';
import { StartupPage } from '../pages/startup/startup';
import { CakeCreatorPage } from '../pages/cake-creator/cake-creator';

@NgModule({
  declarations: [
    LoginPage,
    MyApp,
    HomePage,
    UserPage,
    UserDetailsPage,
    UserPopOverPage,
    StartupPage,
    CakeCreatorPage
  ],
  imports: [
    BrowserModule,
    FormsModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    LoginPage,
    MyApp,
    HomePage,
    UserPage,
    UserDetailsPage,
    UserPopOverPage,
    StartupPage,
    CakeCreatorPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    UserSettings,
    SQLite,
    Camera,
    CameraSettings,
    File,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
