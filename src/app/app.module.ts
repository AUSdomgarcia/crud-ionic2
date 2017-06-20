// import { IonicStorageModule } from '@ionic/storage';
import { LoginPageModule } from '../pages/login/login.module';
import { UserPageModule } from '../pages/user/user.module';
import { UserDetailsPageModule } from '../pages/user-details/user-details.module';
import { UserPopOverPageModule } from '../pages/user-pop-over/user-pop-over.module';
import { StartupPageModule } from '../pages/startup/startup.module';
import { CakeCreatorPageModule } from '../pages/cake-creator/cake-creator.module';
import { CakesHomePageModule } from '../pages/cakes-home/cakes-home.module';
import { CakeNavigationPageModule } from '../pages/cake-navigation/cake-navigation.module';
import { EditStudentPageModule } from '../pages/edit-student/edit-student.module';

import { SyncCmsPageModule } from '../pages/sync-cms/sync-cms.module';
import { SyncListPageModule } from '../pages/sync-list/sync-list.module';
import { SyncNavigationPageModule } from '../pages/sync-navigation/sync-navigation.module';

import { Network } from '@ionic-native/network';
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SQLite } from '@ionic-native/sqlite';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { HomePage } from '../pages/home/home';
import { MyApp } from './app.component';
import { UserSettings, 
CameraSettings,
  Helpers, 
  DeviceSettings, 
  CakeCreatorSettings,
  SyncSettings,
  NetworkSettings,
  WindowService,
  ApiSettings
    } from '../shared/shared';

// import { LoginPage } from '../pages/login/login';
// import { UserPage } from '../pages/user/user';
// import { UserDetailsPage } from '../pages/user-details/user-details';
// import { UserPopOverPage } from '../pages/user-pop-over/user-pop-over';
// import { StartupPage } from '../pages/startup/startup';
// import { CakeCreatorPage } from '../pages/cake-creator/cake-creator';

@NgModule({
  declarations: [
    // LoginPage,
    MyApp,
    HomePage
    // UserPage,
    // UserDetailsPage,
    // UserPopOverPage,
    // StartupPage,
    // CakeCreatorPage
  ],
  imports: [
    BrowserModule,
    FormsModule,
    // TODO: Try using module base declaration
    LoginPageModule,
    UserPageModule,
    UserDetailsPageModule,
    UserPopOverPageModule,
    StartupPageModule,
    CakeCreatorPageModule,
    CakesHomePageModule,
    CakeNavigationPageModule,
    EditStudentPageModule,
    HttpModule,
    // Sync
    SyncCmsPageModule,
    SyncListPageModule,
    SyncNavigationPageModule,
    
    IonicModule.forRoot(MyApp)
    // IonicStorageModule.forRoot({
    //   name: '_4syncdb',
    //   storeName: 'users',
    //   driverOrder: ['sqlite', 'websql']
    // })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    // LoginPage,
    MyApp,
    HomePage
    // UserPage,
    // UserDetailsPage,
    // UserPopOverPage,
    // StartupPage,
    // CakeCreatorPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    UserSettings,
    SQLite,
    Camera,
    CameraSettings,
    DeviceSettings,
    Helpers,
    CakeCreatorSettings,
    SyncSettings,
    NetworkSettings,
    WindowService,
    ApiSettings,
    Network,
    File,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
