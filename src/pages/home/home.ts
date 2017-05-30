import { UserSettings } from '../../shared/shared';
import { Component } from '@angular/core';
import { Events, NavController, NavParams, ToastController } from 'ionic-angular';
import { UserPage } from '../user/user';
import { UserDetailsPage } from '../user-details/user-details';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  users;
  
  constructor(public navCtrl: NavController,
              private navParams: NavParams,
              private userSettings: UserSettings,
              private events: Events,
              private toastCtrl: ToastController) {}
  
  toogleAddUser(){
    this.navCtrl.push(UserPage);
  }

  ionViewDidLoad() {
    this.events.subscribe('user:added', () => this.updateUsers() );

    this.events.subscribe('user:deleted', () => this.updateUsers() );

    this.updateUsers();
  }
  
  updateUsers(){
    this.userSettings.getUsers().then( (users) => { 
      // alert('HOME_UPDATE ' + JSON.stringify(users));
      this.users = users;

    });
  }

  showUser(user){

    this.userSettings.showUser(user.rowid)

    .then( (result) => { 
        this.navCtrl.push(UserDetailsPage, result);
     })
    .catch( (e) => { alert(JSON.stringify(e)) });
  }
}