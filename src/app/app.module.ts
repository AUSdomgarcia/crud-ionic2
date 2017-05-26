import { FormsModule } from '@angular/forms';
import { HomePage } from '../pages/home/home';
import { SQLite } from '@ionic-native/sqlite';
import { UserSettings } from '../shared/shared';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { UserPage } from '../pages/user/user';
import { UserDetailsPage } from '../pages/user-details/user-details';
import { UserPopOverPage } from '../pages/user-pop-over/user-pop-over';

@NgModule({
  declarations: [
    LoginPage,
    MyApp,
    HomePage,
    UserPage,
    UserDetailsPage,
    UserPopOverPage
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
    UserPopOverPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    UserSettings,
    SQLite,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
