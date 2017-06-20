import { File } from '@ionic-native/file';
import { CakeCreatorSettings, Helpers } from '../../shared/shared';
import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the CakesHomePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-cakes-home',
  templateUrl: 'cakes-home.html',
})
export class CakesHomePage {

  cakes = [];

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private cakeCreatorSettings: CakeCreatorSettings,
              private file: File,
              private helpers: Helpers,
              private events: Events) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad CakesHomePage');
    this.refresh();

    this.events.subscribe('cake:added', () => this.refresh() );
  }

  refresh(){
    this.cakeCreatorSettings.getCakes()
      .then( (cakesRef: any) => {

        if(cakesRef.length !== 0){
          let promises = [];
          cakesRef.map( (cake) => {
            promises.push(
              this.file.readAsDataURL(
                cake.pictureURL.substring(0, cake.pictureURL.lastIndexOf('/') + 1),
                this.helpers.toFileName(cake.pictureURL) + '.jpg'
              )
            )
          })

          Promise.all(promises)
            .then( (res) => {
              res.map( (url, index, arr) => {
                cakesRef[index].fixURL = url;
                if(index === arr.length -1){
                  this.cakes = cakesRef;
                }
              })
            })
            .catch( (err) => {
              alert('CAKE-HOME.ts ERR ' + JSON.stringify(err));
            })

        } else {
          this.cakes = [];
        }
      })
      .catch( (err) => {
        alert('CakeHome.ts ' + JSON.stringify(err));
      });
  }
}
