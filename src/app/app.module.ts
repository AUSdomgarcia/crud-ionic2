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

@NgModule({
  declarations: [
    LoginPage,
    MyApp,
    HomePage,
    UserPage
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
    UserPage
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
