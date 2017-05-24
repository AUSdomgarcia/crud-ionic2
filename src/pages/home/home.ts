import { UserSettings } from '../../shared/shared';
import { Component } from '@angular/core';
import { Events, NavController, NavParams } from 'ionic-angular';
import { UserPage } from '../user/user';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  users;
  
  constructor(public navCtrl: NavController,
              private navParams: NavParams,
              private userSettings: UserSettings,
              private events: Events) {}
  
  toogleAddUser(){
    this.navCtrl.push(UserPage);
  }

  ionViewDidLoad() {
    this.events.subscribe('user:added', () => this.updateUsers() );
    this.updateUsers();
  }
  
  updateUsers(){
    this.userSettings.getUsers().then( (users) => { this.users = users } );
  }
}
