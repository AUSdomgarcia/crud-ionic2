import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Tab, Tabs, Events } from 'ionic-angular';

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

  eventPool = [];

  paramCont = { 
                setEvent: (event) => { this.setEventToPool(event) },
                clearEvents: () => { 

                  console.log('syncNavPool', this.eventPool);
                  
                  this.eventPool.map( (event: Function) => {
                    if(event){
                      this.events.unsubscribe('student:update', event);
                      event = null;
                    }
                  });

                  this.eventPool.length = 0;

                  console.log('syncNavPool', this.eventPool);
                }
              };  

  constructor(public navCtrl: NavController, public navParams: NavParams, private events: Events) {

    this.eventPool = [];

    this.syncCms = SyncCmsPage;
    this.syncList = SyncListPage;
  }

  setEventToPool(event){
    this.eventPool.push(event);
  }

  ionViewDidLoad() {
    // let t = this.navCtrl.getActive();
    // console.log('ionViewDidLoad SyncNavigationPage', t.didLeave );
  }

  ionViewWillLeave(){
    if(this.navCtrl.getActive().name === 'SyncNavigationPage'){
      this.paramCont.clearEvents();
    }
    // let listPage: SyncListPage = this.tabOpt.getSelected().root;
    // console.log(listPage);
  }

  tabSelected(tab){
    // console.log(tab);
  }

}
