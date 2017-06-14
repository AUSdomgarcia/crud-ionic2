import { File, DirectoryEntry } from '@ionic-native/file';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Helpers } from './shared';
import * as moment from 'moment';

@Injectable()

export class CakeCreatorSettings {
    constructor(private file: File,
                private helpers: Helpers,
                private sqlite: SQLite){}
    /*
    | SQLite: The creation of cake_entries table
    | was located at user-settings.ts
    |*/
    dropTable(){
        this.sqlite.create({
            name: 'prototype.db',
            location: 'default'
        })
        .then( (db: SQLiteObject) => {
            db.executeSql(`DROP TABLE cake_entries`, [])
            .then(() => {
                // alert('Drop sql successfully');
            })
            .catch( (e) => { alert('DROP_ERROR ' + JSON.stringify(e)) } );
        })
        .catch( (e)=> { alert('DB_CONN_ERROR_DROP ' + JSON.stringify(e)) });
    }   

    truncateTable(){
        this.sqlite.create({
            name: 'prototype.db',
            location: 'default'
        })
        .then( (db: SQLiteObject) => {
            db.executeSql(`DELETE FROM cake_entries`, [])
            .then(() => {
                // alert('truncate sql successfully');
            })
            .catch( (e) => alert('TRUNC_ERROR ' + JSON.stringify(e)) );
        })
        .catch( (e)=> { alert('DB_CONN_ERROR_TRUNC ' + JSON.stringify(e)) });
    }   

    getCakes(){
        let collections = [];
        return new Promise((resolve, reject) => {
            this.sqlite.create({
                name: 'prototype.db',
                location: 'default'
            })
            .then( (db: SQLiteObject) => {
                db.executeSql(`SELECT * FROM cake_entries`, [])
                .then( (res) => { 
                    if(res.rows.item(0)){
                        db.executeSql(`SELECT rowid, 
                                            name, 
                                            pictureURL, 
                                            created_at, 
                                            updated_at
                                        FROM cake_entries`, [])
                        .then( (result) => {
                            for(let i = 0; i < result.rows.length; i++){
                                collections
                                    .push({
                                        rowid: result.rows.item(i).rowid,
                                        name: result.rows.item(i).name,
                                        pictureURL: result.rows.item(i).pictureURL,
                                        created_at: result.rows.item(i).created_at
                                    });
                            }
                            resolve(collections);
                        })
                        .catch( (err) => { 
                            reject(err); // fetch error
                        });

                    } else {
                        collections = [];
                        resolve(collections);
                    }
                 })
                .catch( (err) => { 
                    reject(err); // select items error
                });
            })
            .catch( (err) => { 
                reject(err); // db connection error
            });
        });
    }

    // File access    
    saveEntry(dataURI){
        let myblob = this.helpers.dataURItoBlob(dataURI);
        let newName = 'cake_entry_' + this.helpers.toHashName() + '.jpg';
        
        const saveToLocalFile = () => {
            let promise = new Promise( (resolve, reject) => {
                this.file.resolveLocalFilesystemUrl( this.file.dataDirectory.toString().concat('uploads') )
                .then( (res: DirectoryEntry) => {
                    this.file.writeFile(res.nativeURL, newName, myblob)
                        .then( (res: DirectoryEntry) => {
                            resolve(res.nativeURL);
                        })
                        .catch( (err) => {
                            reject(err);
                        });
                })
                .catch( (err) => {
                    reject(err);
                });
            });
            return promise;
        };

        const saveToSQLite = (path: string) => {
            
            let filename = this.helpers.toFileName(path);

            let promise = new Promise( (resolve, reject) => {
                this.sqlite.create({
                    name: 'prototype.db',
                    location: 'default'
                })
                .then( (db: SQLiteObject) => {
                    db.executeSql(
                        `INSERT INTO cake_entries VALUES (?, ?)`,
                        [
                            filename,
                            path,
                            moment().format('YYYY-MM-DD HH:MM:SS'),
                            moment().format('YYYY-MM-DD HH:MM:SS')
                        ])
                        .then( (res) => { 
                            resolve();
                            // alert('SAVING SUCC ' + JSON.stringify(res) + ' filename: ' + filename + ' path: ' + path );
                        })
                        .catch( (err) => {
                            reject(err);
                        });
                })
                .catch( (err) => {
                    reject(err);
                });
            });
            return promise;
        };

        return saveToLocalFile().then(saveToSQLite);
    }
}