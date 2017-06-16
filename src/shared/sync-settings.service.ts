import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Injectable } from '@angular/core';

declare var window: any;

@Injectable()

export class SyncSettings {

    settings: DatabaseSettings;

    constructor(private sqlite: SQLite){}
    
    initDatabase(isNative: boolean){
        let query = `CREATE TABLE IF NOT EXISTS Students (
                                name TEXT NOT NULL,
                                age INTEGER NOT NULL,
                                information TEXT NOT NULL,
                                created_at TEXT NOT NULL,
                                updated_at TEXT NOT NULL
                            )`;
        
        let data = [];

        this.assignDB(isNative)
            .then( () => {
                this.queryBuilder(query, data)
                    .then((res) => {
                        if(isNative){
                            alert('NATIVE: Successfully created Students table.');
                        } else {
                            alert('WEBSQL: Successfully created Students table.');
                        }
                    })
                    .catch((err) => {
                        alert('SyncSettings.ts QUERYBUILDER ERR' + JSON.stringify(err));
                    });
            })
            .catch( (err) => {
                alert(JSON.stringify('SyncSettings.ts CONNECTION ERR' + err));
            });
    }

    assignDB(isNative: boolean){
        return new Promise( (resolve, reject) => {
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
                resolve();
            })
            .catch( (err) => {
                reject(err);
            });

            } else {
                this.settings = {
                    db: window.openDatabase('syncDB', '1.0', 'syncDB', 5 * 1024 * 1024),
                    type: 'websql'
                };
                resolve();
            }
        });
    }

    getDatabase(){
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