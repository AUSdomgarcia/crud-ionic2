import { UserPage } from '../user/user';
import { UserSettings } from '../../shared/shared';
import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the UserPopOverPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()

@Component({
  selector: 'page-user-pop-over',
  templateUrl: 'user-pop-over.html',
})
export class UserPopOverPage {

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private viewController: ViewController,
              private userSettings: UserSettings,
              private events: Events) {}

  toggleDelete(){

    this.userSettings.deleteUser(this.navParams.data.rowid)
      .then( () => {
        this.viewController.dismiss();
        this.events.publish('close:userPopOver');
      });
  }

  toggleEdit(){

    this.viewController.dismiss();

    this.navCtrl.push(UserPage, this.navParams.data);
    
    // this.events.publish('user:edit');
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad UserPopOverPage');
  }
}
