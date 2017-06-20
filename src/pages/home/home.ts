import { File } from '@ionic-native/file';
import { Helpers, UserSettings } from '../../shared/shared';
import { Component } from '@angular/core';
import { Events, NavController, NavParams, Platform, ToastController } from 'ionic-angular';
import { UserPage } from '../user/user';
import { UserDetailsPage } from '../user-details/user-details';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  users: any;
  // imgSrc;
  
  constructor(public navCtrl: NavController,
              private navParams: NavParams,
              private userSettings: UserSettings,
              private events: Events,
              private toastCtrl: ToastController,
              private platform: Platform,
              private helpers: Helpers,
              private file: File) { this.users = []; }
  
  toogleAddUser(){
    this.navCtrl.push(UserPage);
  }
  
  ionViewDidLoad() {
    this.events.subscribe('user:added', () => this.updateUsers() );
    this.events.subscribe('user:deleted', () => this.updateUsers() );
    this.updateUsers();
  }
  
  updateUsers(){
    this.userSettings.getUsers().then( (users: any) => {

      if(users.length !== 0 ){
          let promises = [];
          users.map( (user) => {
            ///
            // alert('HOME.TS CHECK URL ' +  user.pictureURL );

            if(user.pictureURL.includes('assets')){
                promises.push(user.pictureURL);
            } else {
              promises.push(
                this.file.readAsDataURL(
                user.pictureURL.substring(0, user.pictureURL.lastIndexOf('/') + 1),
                this.helpers.toFileName(user.pictureURL) + '.' + this.helpers.toFileExtension(user.pictureURL))
              );
            }
          ///
          })
          Promise.all(promises)
            .then( (responses) => {
              responses.map((responseUrl, index, arr) => {
                users[index].fixURL = responseUrl;
                if(index === arr.length -1){
                  this.users = users;
                }
              });
            })
            .catch( (err) => {
              alert('HOME.TS_ERR ' +  JSON.stringify(err))
            });
      
      } else {
        this.users = [];
      }
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
