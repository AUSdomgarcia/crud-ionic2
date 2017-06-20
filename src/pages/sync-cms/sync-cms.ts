import { ApiSettings } from '../../shared/api-settings.service';

import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the SyncCmsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-sync-cms',
  templateUrl: 'sync-cms.html',
})
export class SyncCmsPage {

  student: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private apiSettings: ApiSettings,
              private loader: LoadingController) {
                
                this.restruct();
            }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SyncCmsPage');
  }

  restruct(){
    this.student = {
      name: '',
      age: 0,
      information: '',
      level: '',
    }
  }

  toggleAddStudent(student){

    if(student.name === '') return;

    let loading = this.loader.create({
      content: "Saving please wait...",
    });

    loading.present();
    
    this.apiSettings.addStudent(student)
      .then( (res) => {
        loading.dismiss();
        this.restruct();
      })
      .catch( (err) =>{
        alert('SYNC-CMS.ts ERR' + JSON.stringify(err))
      })
  }

}