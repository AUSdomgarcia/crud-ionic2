import { UserSettings, CameraSettings } from '../../shared/shared';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import {
    ActionSheetController,
    Events,
    IonicPage,
    NavController,
    NavParams,
    Platform,
    ViewController
} from 'ionic-angular';

/**
 * Generated class for the UserPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user',
  templateUrl: 'user.html',
})
export class UserPage {

  formGroup: FormGroup;

  hasFullName: Boolean = true;
  hasEmail: Boolean = true;
  hasGender: Boolean = true;
  hasPassword: Boolean = true; 
  hasDescription: Boolean = true;

  isEditing: Boolean = false;

  pictureURL = "";

  rowid;
  user;

  constructor(public navCtrl: NavController, 
              private viewCtrl: ViewController,
              public navParams: NavParams,
              private formBuilder: FormBuilder,
              private userSettings: UserSettings,
              private events: Events,
              private actionSheetCtrl: ActionSheetController,
              public platform: Platform,
              private cameraSettings: CameraSettings) {

                this.formGroup = this.formBuilder.group({
                  fullname : [null, [Validators.required]],
                  email : [null, [Validators.required, Validators.email]],
                  gender: ['select', [Validators.required]],
                  password : [null, [Validators.required]],
                  description: [null, [Validators.required]]
                });

              }
  
  toggleAddUser(formData){

    this.hasFullName = (this.formGroup.controls['fullname'].valid) ? true : false;
    
    this.hasEmail = (this.formGroup.controls['email'].valid) ? true : false;
    
    this.hasGender = (this.formGroup.controls['gender'].value!=="select") ? true : false;
    
    this.hasPassword = (this.formGroup.controls['password'].valid) ? true : false;
    
    this.hasDescription = (this.formGroup.controls['description'].valid) ? true : false;

    if(this.formGroup.valid && this.hasGender){

      if(this.isEditing){

        this.userSettings.updateUser(this.rowid, formData)

          .then( (res) => { 
            
            this.navCtrl.pop();

            // alert('FOO_UPDATE_USER');

            this.events.publish('user:added');

            this.events.publish('userdetails:updated', res );

          })
          .catch( (e) => { 
            alert('UPDATE_USER_ERR ' + JSON.stringify(e))
          });

      } else {
        // alert('to save');
        this.userSettings.addUser(formData)
          .then( (res) => {

            // alert('FOO_ADDING_USER');
            
            this.events.publish('user:added');
            
            this.navCtrl.pop();

          })
          .catch( (e) => { 
            alert('ADD_USER_ERR ' + JSON.stringify(e))
          });
      }
    }
  }
  
  ionViewDidLoad() {
    this.viewCtrl.showBackButton(false);

    for(let prop in this.navParams.data){

      if(this.navParams.data.hasOwnProperty(prop)){
        this.isEditing = true;
        this.user = this.navParams.data;
        
        this.formGroup.controls['fullname'].setValue(this.user.fullname);
        this.formGroup.controls['email'].setValue(this.user.email);
        this.formGroup.controls['gender'].setValue(this.user.gender);
        this.formGroup.controls['password'].setValue(this.user.password);
        this.formGroup.controls['description'].setValue(this.user.description);
        this.rowid = this.navParams.data.rowid;

        break;

      } else {
        this.isEditing = false;
      }
    }
  }
  // toggle outside
  toggleCancel(){
    this.navCtrl.pop();
  }
  
  toggleDone(formData){
    this.toggleAddUser(formData);
  }

  toggleActionSheetImage(event){
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Set image from',
      buttons: [
        {
          text: 'Camera',
          icon: !this.platform.is('ios') ? 'camera' : null,
          handler: () => {
            this.cameraSettings.useCamera();
          }
        },
        {
          text: 'Gallery',
          icon: !this.platform.is('ios') ? 'images' : null,
          handler: () => {
            this.cameraSettings.useGallery();
          }
        },
        {
          text: 'Cancel',
          icon: !this.platform.is('ios') ? 'close' : null,
          role: 'cancel',
          handler: () => {
            //
          }
        }
      ]
    });

    actionSheet.present();
  }

}