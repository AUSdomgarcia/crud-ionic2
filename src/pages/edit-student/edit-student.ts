import { ApiSettings } from '../../shared/api-settings.service';
import { NetworkSettings } from '../../shared/shared';

import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

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
              private toastCtrl: ToastController,
              private events: Events,
              private networkSettings: NetworkSettings) {
    this.student = navParams.data; 
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditStudentPage');
  }

  toggleUpdateStudent(student){
    let toastr;

    if(this.networkSettings.isAvailable()){
      //  
      this.apiSettings.updateStudentDetails(student)
      
      .then( (res) => {
        
        // alert('EDIT-STUDENT.ts updateStudentDetails SUC ' + JSON.stringify(res));
        
        toastr = this.toastCtrl.create({
          message: 'Updated student successfully!',
          duration: 3000
        });

        toastr.present();
        
        this.events.publish('student:update');

        this.navCtrl.pop();

      })
      .catch( (err) => {
        
        alert('XEDIT-STUDENT.ts updateStudentDetails ERR ' + JSON.stringify(err));

      });
      //
    } else {
        toastr = this.toastCtrl.create({
          message: 'No internet available.',
          duration: 3000
        });
        toastr.present();
    }
  }
}
