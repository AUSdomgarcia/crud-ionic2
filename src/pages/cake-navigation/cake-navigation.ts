import { ViewChild } from '@angular/core';
import { CakesHomePage } from '../cakes-home/cakes-home';
import { CakeCreatorPage } from '../cake-creator/cake-creator';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Tab, Tabs } from 'ionic-angular';

/**
 * Generated class for the CakeNavigationPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-cake-navigation',
  templateUrl: 'cake-navigation.html',
})
export class CakeNavigationPage {

  @ViewChild('tabOpt') tabOpt: Tabs;

  createPage: any;
  showAllPage: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.createPage = CakeCreatorPage;
    this.showAllPage = CakesHomePage;
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad CakeNavigationPage');
  }

  tabSelected(tab: Tab){ // this.tabOpt.getActiveChildNav() is also equal to tab:Tab
    //
  }

  ionViewDidLeave(){
    // this.tabOpt.getActiveChildNav().root.prototype.garbageCollect();
  }
}
