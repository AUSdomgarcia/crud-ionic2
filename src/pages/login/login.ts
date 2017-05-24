import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Toast, ToastController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { HomePage } from '../home/home';

/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage {

  private formGroup: FormGroup;
  message: string[];
  
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private toastController: ToastController,
              private formBuilder: FormBuilder) {
              
              this.formGroup = this.formBuilder.group({
                email : [null, [Validators.email]],
                password : [null, [Validators.required]]
              });
            }
  
  toggleLogin(formData){
    this.message = [];
    let spacer = ' ';
    let toastr: Toast;

    if( ! this.formGroup.controls['email'].valid){
      this.message.push(spacer+'Invalid email');
    }
    if( ! this.formGroup.controls['password'].valid){
      this.message.push(spacer+'No password');
    }
    
    if(this.formGroup.valid){
      // TODO:
      if(formData.email === 'dom@yahoo.com' && formData.password === 'aaa'){
        this.navCtrl.setRoot(HomePage);

      } else {
        toastr = this.toastController.create({
          message: 'Invalid credentials',
          duration: 2000,
          position: 'bottom',
          dismissOnPageChange: true,
          cssClass: 'toast-danger'
        });
        toastr.present();
      }
      
    } else {
         toastr = this.toastController.create({
          message: this.message.toString(),
          duration: 2000,
          position: 'bottom',
          dismissOnPageChange: true,
          cssClass: 'toast-danger'
        });
        toastr.present();
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

}
