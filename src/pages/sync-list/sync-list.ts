import { Helpers, ApiSettings, NetworkSettings, SyncSettings } from '../../shared/shared';
import { Component } from '@angular/core';
import { AlertController, IonicPage, LoadingController, NavController, NavParams, ToastController, Events } from 'ionic-angular';
import { EditStudentPage } from '../edit-student/edit-student';
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

  students = [];

  initial_database_loader;

  notice;

  refresherRef;

  studentUpdateSubscribe: any;

  DO_NOTHING = {};

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private syncSettings: SyncSettings,
              private apiSettings: ApiSettings,
              private networkSettings: NetworkSettings,
              private helpers: Helpers,
              private toastCtrl: ToastController,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private events: Events) {}

  toggleUpdate(student){
    this.navCtrl.parent.parent.push(EditStudentPage, student)
  }

  toggleDelete(id){

    if(this.networkSettings.isAvailable()){

      let confirm = this.alertCtrl.create({
        title: 'Delete Entry',
        message: 'Are you sure you want to delete ?',
        buttons: [
          {
            text: 'Yes',
            handler: () => {
              this.deleteStudentById(id)
            }
          },
          {
            text: 'No',
            handler: () => {
              
            }
          }
        ]
      });
      confirm.present();

    } else {
      this.presentToast('No internet available.');
    }

  }

  deleteStudentById(id){
    this.apiSettings.deleteStudent(id)
      .then( (res) =>{
        // alert('SYNC-LIST deleteStudentById SUC' + JSON.stringify(res));
        this.checkDBupdates();
      })
      .catch( (err) =>{
        alert('SYNC-LIST deleteStudentById ERR' + JSON.stringify(err));
      })
  }

  ionViewWillEnter(){
    console.log('will enter');
    // Subscribe::
    this.studentUpdateSubscribe = () => {
      this.checkDBupdates();
    };
    this.events.subscribe('student:update', this.studentUpdateSubscribe);
  }

  ionViewWillLeave(){
    if(this.studentUpdateSubscribe){
      this.events.unsubscribe('student:update', this.studentUpdateSubscribe);
      this.studentUpdateSubscribe = null;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SyncListPage');

    
    // Subscribe::



    
    if(this.networkSettings.isAvailable()){

      alert('Has Internet.');
      
      this.initialDBSync();

    } else {
      // TODO: 
      // At start, internet is required to sync initial database from the server to app.
      alert('No Internet.');

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

  applyChangesBaseOnAction = (res: any) => {
      let promises = [];
      let query;
      let items = [];

      _.map(res, (student, key) => {

        switch(student.action){
          case 'create':
            query = `INSERT INTO students VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
            items = [
                    student._id,
                    student.action,
                    student.name,
                    student.age,
                    student.information,
                    student.level,
                    student.created_at,
                    student.updated_at,
                  ]
            this.processQuery(promises, items, query);
          break;

          case 'update':
            query = `UPDATE students 
                      SET action = ?,
                          name = ?,
                          age = ?,
                          information = ?,
                          level = ?,
                          updated_at = ?
                     WHERE _id = ?`;
            items = [
              'update',
              student.name,
              student.age,
              student.information,
              student.level,
              student.updated_at,
              student._id
            ];

            this.processQuery(promises, items, query);
          break;

          case 'delete':
            query = `UPDATE students 
                      SET action = ?,
                          updated_at = ?
                     WHERE _id = ?`;
            
            items = [
              'delete',
               student.updated_at,
               student._id
            ];

            this.processQuery(promises, items, query);
          break;
        } 
      });

    return Promise.all(promises);
  }

  processQuery(promises, item, query){
    promises.push( 
      this.syncSettings.queryBuilder(query, item)
      );
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
      const parseFromAPI = (res: any) => {
        
        let promise = new Promise( (resolve, reject) => {
        
          if(res.rows.length === 0){
        
            this.initial_database_loader = this.loadingCtrl.create({
              content: "Please wait...",
            });
            
            this.initial_database_loader.present();
            
            this.apiSettings.getStudents()
              .then( students => resolve(students) )
              .catch( (err) => reject(err) )
          
        } else {
            resolve(this.DO_NOTHING);
          }
        });

        return promise;
      }

    /*
    | This code block is executed just to initially sync 
    | data from the server to local SQLite of the app
    | TODO: optimization
    */
      this.checkEmptyDatabase()
        .then(parseFromAPI)
        .then(this.applyChangesBaseOnAction)
        .then((res: Array<any>) => {
          if(res.length === 0){

            this.checkDBupdates(); // When local is already sync, try to sync everytime it loads

          } else {

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
    | At this point, probably we have data already in SQLite/WebSql
    | This method tried to seek any updates from the server
    | using the last updated_at value
    */

    this.checkEmptyDatabase()
    .then( (res: any) => {

      console.log('----CURRENT DB ITEM(s)------->', res.rows.length)

      if(res.rows.length !== 0){

        this.getStudentsFromSQLite()

        .then( (res: any) => {

          let timestamp = parseInt(res.rows.item(0).updated_at);

          this.apiSettings 

            .checkUpdateByTimestamp(timestamp)

              .then( (res) => {
                  
                  if( ! _.isEmpty(res)){

                    console.log('has changes on object:', res);

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
                alert('SYNC-LIST.ts checkUpdatesByTime ERR ' + err);
              });
        })
        .catch( (err) => {
          alert('SNYC-LIST.ts getStudentsFromSQLite ERR ' + JSON.stringify(err));
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

    this.applyChangesBaseOnAction(res)
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

  getStudentsFromSQLite(){
    let collections = [];
    let query = `SELECT rowid, _id, name, age, information, level, created_at, updated_at, action
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
    this.students = [];

    this.getStudentsFromSQLite()
      .then( (res: any) => {

        for(let i = 0; i < res.rows.length; i++){

            if(res.rows.item(i).action !== 'delete'){
              collections.push({
                _id: res.rows.item(i)._id,
                rowid: res.rows.item(i).rowid,
                name: res.rows.item(i).name,
                age: res.rows.item(i).age,
                information: res.rows.item(i).information,
                level: res.rows.item(i).level,
                created_at: res.rows.item(i).created_at,
                updated_at: res.rows.item(i).updated_at,
              });
            }

            if(i === res.rows.length - 1){
              this.students = collections;

              if(collections.length===0){
                console.log('binding to html', collections, this.students);
                // this.students.length = 0;
                // collections.length = 0;
                this.resetStudents();
              }
            }
        }
      })
      .catch( (err) => {
        console.log('Sync-list.ts POPULATE ERROR');
      });
  }

  resetStudents(){
    this.students.length = 0;
  }
  
  refreshAll(refresher){
    this.refresherRef = refresher;

    // TODO: check connection before allow to pull
    if( this.networkSettings.isAvailable() ){
      this.checkDBupdates();
    } else {
      this.refresherRef.complete();
      this.presentToast('No internet available.');
    }
  }
}
