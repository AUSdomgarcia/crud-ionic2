import { SyncSettings } from '../../shared/sync-settings.service';
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

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private syncSettings: SyncSettings) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad SyncListPage');

    let query = `
                CREATE TABLE IF NOT EXISTS LOGS (id unique, log)
                `;
    let data = [];

    this.syncSettings.queryBuilder(query, data)
      .then((res) => {
        alert('Created! ' + JSON.stringify(res) + ' ' + this.syncSettings.getDB().type);
        this.insertdataTest();
      })
      .catch((err) => {
        alert(JSON.stringify(err));
      });
  }

  insertdataTest(){
    let query = `
                INSERT INTO LOGS (id, log) VALUES(?,?)
                `;
    let data = [5, 'Rowi'];

    this.syncSettings.queryBuilder(query, data)
      .then((res) => {
        alert('Inserted! ' + JSON.stringify(res) + ' ' + this.syncSettings.getDB().type);
      })
      .catch((err) => {
        alert(JSON.stringify(err));
      });
  }
}
