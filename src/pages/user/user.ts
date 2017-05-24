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
      this.userSettings.addUser(formData);
    }
  }
  
  ionViewDidLoad() {
    this.viewCtrl.showBackButton(false);
    this.events.subscribe('user:added', () => this.toggleCancel() );
  }

  toggleCancel(){
    this.navCtrl.popToRoot();
  }

  toggleDone(formData){
    this.toggleAddUser(formData);
  }

}
