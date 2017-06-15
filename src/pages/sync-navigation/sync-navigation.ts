import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Tab, Tabs } from 'ionic-angular';

import { SyncCmsPage } from '../sync-cms/sync-cms';
import { SyncListPage } from '../sync-list/sync-list';

/**
 * Generated class for the SyncNavigationPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-sync-navigation',
  templateUrl: 'sync-navigation.html',
})
export class SyncNavigationPage {
  
  @ViewChild('tabOpt') tabOpt: Tabs;

  syncCms;
  syncList;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.syncCms = SyncCmsPage;
    this.syncList = SyncListPage;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SyncNavigationPage');
  }

  tabSelected(tab: Tab){
    //
  }

}
