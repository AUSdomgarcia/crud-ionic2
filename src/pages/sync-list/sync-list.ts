import { Helpers, ApiSettings, NetworkSettings, SyncSettings } from '../../shared/shared';
import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams, ToastController } from 'ionic-angular';
import * as _ from 'lodash';
/**
 * Generated class for the SyncListPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-sync-list',
  templateUrl: 'sync-list.html',
})
export class SyncListPage {

  students;

  initial_database_loader;

  notice;

  latestTimeRef;

  refresherRef;

  DO_NOTHING_HERE = {};

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private syncSettings: SyncSettings,
              private apiSettings: ApiSettings,
              private networkSettings: NetworkSettings,
              private helpers: Helpers,
              private toastCtrl: ToastController,
              private loadingCtrl: LoadingController) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad SyncListPage');
    
    if(this.networkSettings.isAvailable()){
      
      this.initialDBSync();

    } else {
      // TODO: 
      // At start, internet is required to sync initial database from the server to app.
      alert('No internet.');

      this.processOffline();
    }
  }

  processOffline(){
    // Try to view database if not empty
    this.checkEmptyDatabase()
    .then( (res: any) => {
      if(res.rows.length !== 0){

        this.populateStudents();

      } else {
        this.presentToast('Connection required.');
      }
    })
    .catch( (err) => {
      alert('SYNC-LIST.ts checkEmptyDatabase ERR' + JSON.stringify(err));
    });
  }

  multiple_db_insert = (res: any) => {
      let promises = [];
      let query = `INSERT INTO students VALUES (?, ?, ?, ?, ?, ?)`;

      _.map(res, (student, key) => {
          promises.push( 
            this.syncSettings.queryBuilder(query, 
              [
                student.name,
                student.age,
                student.information,
                student.level,
                student.created_at,
                student.updated_at,
              ])
            );
      });

    return Promise.all(promises);
  }

  checkEmptyDatabase = () => {
    let query = `SELECT * from students`;

    let promise = new Promise( (resolve, reject) => {
      this.syncSettings.queryBuilder(query, [])
        .then( (res) => { 
          resolve(res);
        })
        .catch( (err) => {
          reject(err);
        });
    });
    return promise;
  }

  initialDBSync(){
    /*
    | This code block is executed just to initially sync 
    | data from the server to local SQLite of the app
    | TODO: optimization
    */
      const parseFromAPI = (res: any) => {
        let promise = new Promise( (resolve, reject) => {

          // If database is empty parse initial data from Firebase
          if(res.rows.length === 0){

            this.initial_database_loader = this.loadingCtrl.create({
              content: "Please wait...",
            });

            this.initial_database_loader.present();

            this.apiSettings.getStudents()
              .then( students => resolve(students) )
              .catch( (err) => reject(err) )
          // When not empty try to seek for any update/change from Firebase
          } else {
            resolve(this.DO_NOTHING_HERE);
          }
        });

        return promise;
      }

      this.checkEmptyDatabase()
        .then(parseFromAPI)
        .then(this.multiple_db_insert)
        .then((res: Array<any>) => {

          // Initial fill to database done.
          if(res.length === 0){

            this.checkDBupdates();

          } else {
            // NOTICE: when firstime database created.
            this.initial_database_loader.dismiss();

            this.populateStudents();
          }

        })
        .catch((err)=> {
          console.log('error', err);
        });
  }

  checkDBupdates(){
    /* 
    | At this point, probably we have data already
    | This method tried to seek any updates from the server
    | using the last updated_at value
    */
    this.checkEmptyDatabase()
    .then( (res: any) => {
      if(res.rows.length !== 0){

        this.getStudents()

        .then( (res: any) => {

          this.latestTimeRef = parseInt(res.rows.item(0).updated_at);

          this.apiSettings 

            .checkUpdates(this.latestTimeRef)

              .then( (res) => {
                  
                  if( ! _.isEmpty(res)){

                    this.updateLocalDatabase(res);

                  } else {

                    this.populateStudents();

                    this.presentToast('Everything is up to date.');

                    if(this.refresherRef){
                      this.refresherRef.complete();
                      this.refresherRef = null;
                    }

                  }
              })
              .catch( (err) => {
                alert('SYNC-LIST.ts checkUpdates ERR ' + err);
              });
        })
        .catch( (err) => {
          alert('SNYC-LIST.ts getStudents ERR ' + JSON.stringify(err));
        });
      }
    })
    .catch( (err) => {
      alert('SYNC-LIST.ts checkEmptyDatabase ERR ' + JSON.stringify(err));
    });

  }

  updateLocalDatabase(res){
    let loader = this.loadingCtrl.create({
      content: "Preparing for updates...",
    });

    loader.present();

    this.multiple_db_insert(res)
      .then( (res) => {
          
          loader.dismiss();

          this.populateStudents();

          if(this.refresherRef){
            this.refresherRef.complete();
            this.refresherRef = null;
          }
      })
      .catch( (err) => {
        alert('SYNC-LIST.ts updateLocalDatabase ERR ' + JSON.stringify(err));
      });
  }

  presentToast(message){
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

  getStudents(){
    let collections = [];
    let query = `SELECT rowid, name, age, information, level, created_at, updated_at
                FROM students
                ORDER BY updated_at 
                DESC
                `;

    let promise = new Promise( (resolve, reject) => {
        this.syncSettings.queryBuilder(query, [])
        .then( (res: any) => {
          resolve(res);
        })
        .catch( (err) => {
          reject(err);
        });
    });

    return promise;
  }

  populateStudents(){
    let collections = [];

    this.getStudents()
      .then( (res: any) => {
        for(let i = 0; i < res.rows.length; i++){
            collections.push({
              rowid: res.rows.item(i).rowid,
              name: res.rows.item(i).name,
              age: res.rows.item(i).age,
              information: res.rows.item(i).information,
              level: res.rows.item(i).level,
              created_at: res.rows.item(i).created_at,
              updated_at: res.rows.item(i).updated_at,
            });

            if(i === res.rows.length - 1){
              this.students = collections;
            }
        }
      })
      .catch( (err) => {
        console.log('Sync-list.ts POPULATE ERROR');
      });
  }
  
  refreshAll(refresher){
    this.refresherRef = refresher;
    this.checkDBupdates();
  }
}
