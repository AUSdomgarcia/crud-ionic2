import { HomePage } from '../home/home';
import { UserSettings } from '../../shared/shared';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the UserPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

ViewController
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

  isEdit: Boolean = false;
  rowid;
  user;

  constructor(public navCtrl: NavController, 
              private viewCtrl: ViewController,
              public navParams: NavParams,
              private formBuilder: FormBuilder,
              private userSettings: UserSettings,
              private events: Events) {

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

      if(!this.isEdit){
        this.userSettings.addUser(formData);
      } else {
        this.userSettings.updateUser(this.rowid, formData);
      }
    }
  }
  
  ionViewDidLoad() {
    this.viewCtrl.showBackButton(false);
    
    this.events.subscribe('user:added', () => this.toggleCancel() );

    // this.events.subscribe('user:updated', () => this.toggleCancel() );

    // alert('@user ' + JSON.stringify(this.navParams.data));

    for(let prop in this.navParams.data){
      if(this.navParams.data.hasOwnProperty(prop)){
        this.isEdit = true;
        this.user = this.navParams.data;
        
        this.formGroup.controls['fullname'].setValue(this.user.fullname);
        this.formGroup.controls['email'].setValue(this.user.email);
        this.formGroup.controls['gender'].setValue(this.user.gender);
        this.formGroup.controls['password'].setValue(this.user.password);
        this.formGroup.controls['description'].setValue(this.user.description);
        this.rowid = this.navParams.data.rowid;

      } else {
        this.isEdit = false;
      }
    }
  }

  toggleCancel(){
    this.navCtrl.pop();
  }

  toggleDone(formData){
    this.toggleAddUser(formData);
  }

}
