import { CameraSettings } from '../../shared/camera-settings.service';
import { UserPage } from '../user/user';
import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams, PopoverController, ToastController } from 'ionic-angular';
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
  imgSrc;

  popOverSubscribe: any;

  userDetailsSubscribe: (res:any) => void;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private popoverController: PopoverController,
              private events: Events,
              private toastCtrl: ToastController,
              private cameraSettings: CameraSettings) 

              { }
              
  ionViewDidLoad() {

    this.initData();
    // subscribe 
    this.popOverSubscribe = () => {
      this.leaveAfterDelete();

    }
    this.events.subscribe('user:popover', this.popOverSubscribe);

    // subscribe 
    this.userDetailsSubscribe = (res) => {

      this.onUserDetailsUpdate(res);

      this.showUpdateToaster();

    }
    this.events.subscribe('userdetails:updated', this.userDetailsSubscribe );
  }

  onUserDetailsUpdate(res){
    this.user = res;
    this.updateImageSrc();
  }

  initData(){
    this.user = this.navParams.data;
    this.updateImageSrc();
  }
  
  updateImageSrc(){
    if( ! this.user.pictureURL.includes('assets')){
       this.cameraSettings.toBase64(this.user.pictureURL)
      .then( (res) => {
        this.imgSrc = res;
      })
      .catch( e => { alert('USER_DETAILS_ERR ' + JSON.stringify(e) )});
    } else {
      this.imgSrc = this.user.pictureURL;
    }
  }

  showUpdateToaster(){
    let toaster = this.toastCtrl.create({
      message: 'User details updated successfully.',
      duration: 3000
    });

    toaster.present();
  }

  ionViewWillLeave(){
    if(this.popOverSubscribe){
      this.events.unsubscribe('user:popover', this.popOverSubscribe);
      this.popOverSubscribe = null;
    }

    if(this.userDetailsSubscribe){
      this.events.unsubscribe('userdetails:updated', this.userDetailsSubscribe );
      this.userDetailsSubscribe = null;
    }
  }

  leaveAfterDelete(){
    let toaster = this.toastCtrl.create({
      message: 'User was deleted successfully.',
      duration: 3000
    });

    toaster.present();

    this.navCtrl.pop();
  }

  toggleOptions(event){
    let popOptions = this.popoverController.create(UserPopOverPage, this.user); //this.navParams.data);
    
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
  pictureURL;
}