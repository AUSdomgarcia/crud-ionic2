import { Helpers, ApiSettings, NetworkSettings, SyncSettings } from '../../shared/shared';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
// import * as moment from 'moment';
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
  notice;
  DO_NOTHING_HERE = {};

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private syncSettings: SyncSettings,
              private apiSettings: ApiSettings,
              private networkSettings: NetworkSettings,
              private helpers: Helpers) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad SyncListPage');
    
    if(this.networkSettings.isAvailable()){
      
      this.initialDBSync();

    } else {
      // TODO: 
      // At start, internet is required to sync initial database from the server to app.
    }
    
  }

  initialDBSync(){
    /*
    | This code block is executed just to initially sync 
    | data from the server to local SQLite of the app
    | TODO: optimization
    */

    const checkEmptyDatabase = () => {
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

      const parseFromAPI = (res: any) => {
        let promise = new Promise( (resolve, reject) => {

          if(res.rows.length === 0){
            this.apiSettings.getStudents()
              .then( students => {
                resolve(students); 
              })
              .catch( (err) => {
                reject(err);
              });
          } else {
            resolve(this.DO_NOTHING_HERE);
          }
        });

        return promise;
      }

      const syncOnce = (res: any) => {
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

      checkEmptyDatabase()
        .then(parseFromAPI)
        .then(syncOnce)
        .then((res: Array<any>) => {
          // Initial fill to database done.
          if(res.length === 0){
            console.log('Already filled.');
          } else {
            console.log('Initial filled.');
          }

          this.getAllStudents();

        })
        .catch((err)=> {
          console.log('error', err);
        });
  }

  getAllStudents(){
    let collections = [];
    let query = `SELECT rowid, name, age, information, level, created_at, updated_at
                FROM students
                `;
    this.syncSettings.queryBuilder(query, [])
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
        console.log('Sync-list.ts POPULATE ERROR')
      });
  }
  
  refreshAll(refresher){
    
  }
}
