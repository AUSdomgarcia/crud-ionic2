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

  users: any;
  // imgSrc;
  
  constructor(public navCtrl: NavController,
              private navParams: NavParams,
              private userSettings: UserSettings,
              private events: Events,
              private toastCtrl: ToastController,
              private platform: Platform,
              
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
                this.getFileName(user.pictureURL) + '.' + this.getFileExtension(user.pictureURL))
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

  getFileExtension = function(url) {
      return url.split('.').pop().split(/\#|\?/)[0];
  }

  getFileName(url) {
      if (url) {
          var m = url.toString().match(/.*\/(.+?)\./);
          if (m && m.length > 1) {
              return m[1];
          }
      }
      return '';
  }
}
