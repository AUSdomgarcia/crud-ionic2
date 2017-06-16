import { ApiSettings, SyncSettings } from '../../shared/shared';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the SyncListPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-sync-list',
  templateUrl: 'sync-list.html',
})
export class SyncListPage {

  students;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private syncSettings: SyncSettings,
              private apiSettings: ApiSettings) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad SyncListPage');

    this.apiSettings.getStudents().then( res => console.log(res) );
  }
}
