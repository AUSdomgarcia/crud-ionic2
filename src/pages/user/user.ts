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
  hasPictureURL: Boolean = true;
  hasPassword: Boolean = true; 
  hasDescription: Boolean = true;

  isEditing: Boolean = false;

  DEFAULT_URL = 'assets/uploads/user.jpg';

  imgSrc = this.DEFAULT_URL;
  
  rawPath: string = this.DEFAULT_URL;

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
                  description: [null, [Validators.required]],
                  pictureURL: [this.DEFAULT_URL, [Validators.required]]
                });

              }
  
  toggleAddUser(formData){

    this.hasFullName = (this.formGroup.controls['fullname'].valid) ? true : false;
    
    this.hasEmail = (this.formGroup.controls['email'].valid) ? true : false;
    
    this.hasGender = (this.formGroup.controls['gender'].value!=="select") ? true : false;
    
    this.hasPassword = (this.formGroup.controls['password'].valid) ? true : false;
    
    this.hasDescription = (this.formGroup.controls['description'].valid) ? true : false;

    this.hasPictureURL = true;

    if(this.formGroup.valid && this.hasGender && this.hasPictureURL){

      if(this.isEditing){

        formData['pictureURL'] = this.rawPath;

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
        formData['pictureURL'] = this.rawPath;
        // alert('WHEN SUBMIT ' + JSON.stringify(formData));
        
        this.userSettings.addUser(formData)
          .then( (res) => {
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
        // alert('ON_EDIT ' + JSON.stringify(this.user));
        
        this.formGroup.controls['fullname'].setValue(this.user.fullname);
        this.formGroup.controls['email'].setValue(this.user.email);
        this.formGroup.controls['gender'].setValue(this.user.gender);
        this.formGroup.controls['password'].setValue(this.user.password);
        this.formGroup.controls['description'].setValue(this.user.description);
        this.formGroup.controls['pictureURL'].setValue(this.user.pictureURL);

        this.rawPath = this.user.pictureURL;

        if( ! this.user.pictureURL.includes('assets')){
          this.cameraSettings.toBase64(this.user.pictureURL)
            .then( (res) => {
              this.imgSrc = res;
            })
            .catch( (err) => { 
              alert('USER_EDIT_ERR ' + JSON.stringify(err))
            });

        } else {
          this.imgSrc = this.user.pictureURL;
        }

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
          icon: ! this.platform.is('ios') ? 'camera' : null,
          handler: () => {
            this.openCamera();
          }
        },
        {
          text: 'Gallery',
          icon: ! this.platform.is('ios') ? 'images' : null,
          handler: () => {
            this.openGallery();
          }
        },
        {
          text: 'Cancel',
          icon: ! this.platform.is('ios') ? 'close' : null,
          role: 'cancel',
          handler: () => {
            //
          }
        }
      ]
    });

    actionSheet.present();
  }

  openCamera(){
    this.cameraSettings.useCamera()
    .then( (uri) => {

      this.rawPath = uri.toString();

      this.cameraSettings.toBase64(uri)
        .then( (base64) => { 
          this.imgSrc = base64;
        })
        .catch( (err) => { 
          alert('USER_TO_BASE64_ERR ' + JSON.stringify(err) ) 
        });
    })
    .catch( (err) => { 
      alert('USER_OPEN_CAMERA_ERR ' + JSON.stringify(err))
    });
  }

  openGallery(){
    this.cameraSettings.useGallery()
    .then( (uri) => {

      this.rawPath = uri.toString();

      this.cameraSettings.toBase64(uri)
        .then( (base64) => { 
          this.imgSrc = base64;
        })
        .catch( (err) => { 
          alert('USER_TO_BASE64_ERR ' + JSON.stringify(err) ) 
        });
    })
    .catch( (err) => { 
      alert('USER_OPEN_GALLERY_ERR ' + JSON.stringify(err) )
    });
  }
}
