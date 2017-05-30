import { File } from '@ionic-native/file';
import { UserSettings } from '../../shared/shared';
import { Component } from '@angular/core';
import { Events, NavController, NavParams, Platform, ToastController } from 'ionic-angular';
import { UserPage } from '../user/user';
import { UserDetailsPage } from '../user-details/user-details';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  users = {};

  imgSrc;
  
  constructor(public navCtrl: NavController,
              private navParams: NavParams,
              private userSettings: UserSettings,
              private events: Events,
              private toastCtrl: ToastController,
              private platform: Platform,
              
              private file: File) {}
  
  toBase64(){
    this.file.readAsDataURL(
    'file:///data/data/io.ionic.prop001/files/uploads/',
    '1234.jpg')
    .then( (res) => {
      // alert('IMG_SUCCESS ' + JSON.stringify(res));
      this.imgSrc = res;
    })
    .catch( (err) => {
      alert('IMG_ERR ' + JSON.stringify(err));
    });
  }
  
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
      this.users = users;
      this.toBase64(); //test lang
    });
  }
  
  isEmpty(obj){
      return (Object.getOwnPropertyNames(obj).length === 0);
  }

  showUser(user){

    this.userSettings.showUser(user.rowid)

    .then( (result) => { 
        this.navCtrl.push(UserDetailsPage, result);
     })
    .catch( (e) => { alert(JSON.stringify(e)) });
  }
}
