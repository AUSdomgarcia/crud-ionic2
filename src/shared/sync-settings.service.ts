import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Injectable } from '@angular/core';

declare var window: any;

@Injectable()

export class SyncSettings {

    settings: DatabaseSettings;

    constructor(private sqlite: SQLite){}

    assignDB(isNative: boolean){
       if(isNative){
            this.sqlite.create({
                name: 'syncDB.db',
                location: 'default'
            })
            .then( (db: SQLiteObject) => {
                this.settings = {
                    db: db,
                    type: 'sqlite'
                };
            })
            .catch( (err) => {
                alert(JSON.stringify('SyncSettings.ts ' + err));
            });

       } else {
            this.settings = {
                db: window.openDatabase('syncDB', '1.0', 'syncDB', 5 * 1024 * 1024),
                type: 'websql'
            };
        }
    }

    getDB(){
        return this.settings;
    }

    queryBuilder(query: string, data: Array<any>){
        let promise = new Promise( (resolve, reject) => {
            switch(this.settings.type){
                case 'sqlite':
                    this.settings.db
                        .then( (db: SQLiteObject) => {
                            db.executeSql(query, data)
                                .then( (res) => {
                                    resolve(res);
                                })
                                .catch((err)=>{
                                    reject(err);
                                });
                        })
                        .catch( (err) => {
                            reject(err);
                        });
                break;

                case 'websql':
                    this.settings.db
                        .transaction( (tx: any) => {
                            tx.executeSql(query, data, (tx, results) => { 
                                resolve(results);
                            }, null);
                    });
                break;
            }
        });
        return promise;
    }
}

interface DatabaseSettings {
    db: any,
    type: string
}