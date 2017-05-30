import { HomePage } from '../pages/home/home';
import { UserSettings, CameraSettings } from '../shared/shared';
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';

@Component({
  templateUrl: 'app.html'
})

export class MyApp {

  // rootPage:any = LoginPage;
  rootPage:any = HomePage;

  constructor(private platform: Platform, 
              statusBar: StatusBar, 
              splashScreen: SplashScreen,
              userSettings: UserSettings,
              cameraSettings: CameraSettings) {

    platform.ready().then((device) => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      let isNative = false;
       
      if(this.platform.is('cordova')){
        isNative = true;
        userSettings.initSQLite(isNative);
        cameraSettings.initFileDirectory(this.platform);
      }
    });
  }
}