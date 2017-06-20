import { SyncSettings, NetworkSettings } from '../shared/shared';
import { CakeNavigationPage } from '../pages/cake-navigation/cake-navigation';
import { SyncNavigationPage } from '../pages/sync-navigation/sync-navigation';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';

import { UserSettings, CameraSettings, DeviceSettings } from '../shared/shared';
import { HomePage } from '../pages/home/home';
// import { LoginPage } from '../pages/login/login';
import { StartupPage } from '../pages/startup/startup';

@Component({
  templateUrl: 'app.html'
})

export class MyApp {

  @ViewChild(Nav) nav: Nav;

  // rootPage:any = LoginPage;
  rootPage:any = StartupPage;

  constructor(private platform: Platform, 
              statusBar: StatusBar, 
              splashScreen: SplashScreen,
              userSettings: UserSettings,
              cameraSettings: CameraSettings,
              deviceSettings: DeviceSettings,
              syncSettings: SyncSettings,
              networkSettings: NetworkSettings) {
    
    let isNative = false;
    
    platform.ready().then((device) => {
        // Okay, so the platform is ready and our plugins are available.
        // Here you can do any higher level native things you might need.
        statusBar.styleDefault();

        splashScreen.hide();

        alert('WHAT_HAPPEN?' + this.platform.is('cordova'));
        
        if(this.platform.is('cordova')){
          isNative = true;

          cameraSettings.initFileDirectory(this.platform);

          deviceSettings.add(platform); 

          userSettings.initSQLite(isNative);

          syncSettings.initDatabase(isNative);
          
          this.rootPage = HomePage;
          
          networkSettings.init();

        } else {
          console.log('=else=');
          
          syncSettings.initDatabase(isNative);

          networkSettings.init();
        }
    });
  }

  toggleCanvas(){
    if(this.nav.getActive().name !== 'CakeNavigationPage'){
      this.nav.push(CakeNavigationPage);
    }
  }

  toggleSyncManager(){
    console.log('MY ACTIVE PAGE: ', this.nav.getActive().name );

    if((this.nav.getActive().name !== 'SyncNavigationPage') && (this.nav.getActive().name !== 'EditStudentPage')){
      this.nav.push(SyncNavigationPage);
    }
  }

}
