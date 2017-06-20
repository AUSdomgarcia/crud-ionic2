import { ApiSettings } from '../../shared/api-settings.service';

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

/**
 * Generated class for the EditStudentPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-edit-student',
  templateUrl: 'edit-student.html',
})

export class EditStudentPage {

  student;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private apiSettings: ApiSettings,
              private toastCtrl: ToastController) {
    this.student = navParams.data; 
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditStudentPage');
  }

  toggleUpdateStudent(student){

    this.apiSettings.updateStudentDetails(student)
      .then( (res) => {
        // alert('EDIT-STUDENT.ts updateStudentDetails SUC ' + JSON.stringify(res));
        let toastr = this.toastCtrl.create({
          message: 'Updated student successfully!',
          duration: 3000
        });

        toastr.present();

      })
      .catch( (err) => {
        alert('EDIT-STUDENT.ts updateStudentDetails ERR ' + JSON.stringify(err));
      })
    
  }

}
