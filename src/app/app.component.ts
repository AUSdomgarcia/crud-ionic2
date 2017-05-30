import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';

import { UserSettings, CameraSettings } from '../shared/shared';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { StartupPage } from '../pages/startup/startup';


@Component({
  templateUrl: 'app.html'
})

export class MyApp {

  // rootPage:any = LoginPage;
  rootPage:any = StartupPage;

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
        
        this.rootPage = HomePage;

        userSettings.initSQLite(isNative);
        cameraSettings.initFileDirectory(this.platform);
      }
      
    });
  }
}
