import { HomePage } from '../home/home';
import { UserPage } from '../user/user';
import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { UserPopOverPage } from '../user-pop-over/user-pop-over';

/**
 * Generated class for the UserDetailsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()

@Component({
  selector: 'page-user-details',
  templateUrl: 'user-details.html',
})

export class UserDetailsPage {

  user: UserSchema;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private popoverController: PopoverController,
              private events: Events) {}

  ionViewDidLoad() {
    this.user = this.navParams.data;

    this.events.subscribe('close:userPopOver', () => this.gotoPage() );

    this.events.subscribe('user:updated', () => this.gotoPage() );
  }

  gotoPage(){
    if(this.navCtrl.canGoBack()){
        this.navCtrl.popTo(HomePage);
      }
  }

  ionViewDidLeave(){
    this.events.unsubscribe('close:userPopOver', () => this.gotoPage() );
    this.events.unsubscribe('user:updated', () => this.gotoPage() );
  }

  toggleOptions(event){
    let popOptions = this.popoverController.create(UserPopOverPage, this.navParams.data);
    
    popOptions.present({
      ev: event
    });
  }
}

interface UserSchema {
  rowid;
  email;
  fullname;
  password;
  gender;
  description;
}