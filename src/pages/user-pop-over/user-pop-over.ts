import { HomePage } from '../home/home';
import { UserPage } from '../user/user';
import { UserSettings } from '../../shared/shared';
import { Component } from '@angular/core';
import { AlertController, Events, IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

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

  userDetailsSubscribe: (res:any) => void;

  user;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private viewController: ViewController,
              private userSettings: UserSettings,
              private events: Events,
              private alertCtrl: AlertController) {}

  toggleDelete(){
    
    let confirm = this.alertCtrl.create({
      title: 'Delete Contact',
      message: 'Are you sure you want to delete?',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.userSettings.deleteUser(this.navParams.data.rowid)
            .then( () => {
              
              this.events.publish('user:popover');

            });
          }
        },
        {
          text: 'Cancel',
          handler: () => { /* */ }
        }
      ]
    });

    this.viewController.dismiss();
    confirm.present();
  }

  toggleEdit(){
    this.viewController.dismiss();
    this.navCtrl.push(UserPage, this.user);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserPopOverPage');
    this.user = this.navParams.data;
  }

  ionViewWillLeave(){ /* */ }

}
