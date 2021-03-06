import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';

@Injectable()

export class UserSettings {

    constructor(private sqlite: SQLite, private events:Events ){}

    truncateTable(){
        this.sqlite.create({
            name: 'prototype.db',
            location: 'default'
        })
        .then( (db: SQLiteObject) => {
            db.executeSql(`DELETE FROM users`, [])
            .then(() => {
                // alert('truncate sql successfully');
            })
            .catch( (e) => alert('TRUNC_ERROR ' + JSON.stringify(e)) );
        })
        .catch( (e)=> { alert('DB_CONN_ERROR_TRUNC ' + JSON.stringify(e)) });
    }

    dropTable(){
        this.sqlite.create({
            name: 'prototype.db',
            location: 'default'
        })
        .then( (db: SQLiteObject) => {
            db.executeSql(`DROP TABLE users`, [])
            .then(() => {
                // alert('Drop sql successfully');
            })
            .catch( (e) => { alert('DROP_ERROR ' + JSON.stringify(e)) } );
        })
        .catch( (e)=> { alert('DB_CONN_ERROR_DROP ' + JSON.stringify(e)) });
    }
    
    initSQLite(isNative){
        // this.truncateTable();

        if(isNative){
            this.sqlite.create({
                name: 'prototype.db',
                location: 'default'
            })
            .then( (db: SQLiteObject) => {

                // Users DB
                db.executeSql(
                        `CREATE TABLE IF NOT EXISTS users (
                            email TEXT NOT NULL,
                            fullname TEXT NOT NULL,
                            password TEXT NOT NULL,
                            gender TEXT NOT NULL,
                            description TEXT NOT NULL,
                            pictureURL TEXT NOT NULL
                        )`, [])

                        .then(() => { 
                            // alert('NATIVE sql successfully!') 
                        })
                        .catch( (e) => alert('CREATE_USER_DB_ERROR ' + JSON.stringify(e)) );
                
                // Canvas upload DB
                db.executeSql(
                            `CREATE TABLE IF NOT EXISTS cake_entries (
                                name TEXT NOT NULL,
                                pictureURL TEXT NOT NULL,
                                created_at TEXT NOT NULL,
                                updated_at TEXT NOT NULL
                            )`, [])

                        .then( ()=> {
                            //
                        })
                        .catch( (e) => alert('CREATE_CANVAS_UPLOAD_DB_ERROR ' + JSON.stringify(e)) );
            })
            .catch( (e)=> { alert('DB_CONN_ERROR_INIT ' + JSON.stringify(e)) });
        }
        
        if( ! isNative){
            // let db = window
            //     .sqlitePlugin
            //     .openDatabase({ name: 'prototype.db', location: 'default' }, 
            //     function (db) {
            //         alert('WEBSQL executed sql successfully!');

            //     }, function (error) {
            //         console.log('Open database ERROR Y: ' + JSON.stringify(error));
            //     });
        }
    }

    addUser(formData){
        return new Promise( (resolve, reject) => {
            this.sqlite.create({
                name: 'prototype.db',
                location: 'default'
            })
            .then( (db: SQLiteObject) => {
                db.executeSql(
                        `INSERT INTO users VALUES (?, ?, ?, ?, ?, ?)`,
                        [
                            formData['email'],
                            formData['fullname'],
                            formData['password'],
                            formData['gender'],
                            formData['description'],
                            formData['pictureURL']
                        ])
                        .then(() => { 
                            resolve();
                        })
                        .catch( (e) => {
                            alert('CREATE_ERROR ' + JSON.stringify(e));
                            reject();
                        });
            })
            .catch( (e)=> { 
                alert('DB_CONN_ERROR_ADD ' + JSON.stringify(e));
                reject();
            });
        });
    }

    getUsers(){
        let collections = [];

        return new Promise((resolve, reject) => {
            this.sqlite.create({
                name: 'prototype.db',
                location: 'default'
            })
            .then( (db: SQLiteObject) => {
                
                db.executeSql(`SELECT * FROM users`, [])
                
                .then( (res) => { 

                    // alert('GET_USERS ' + res.rows.item(0));

                    if(res.rows.item(0)){
                        
                        db.executeSql(`SELECT rowid, email, fullname, password, gender, description, pictureURL
                                        FROM users`, [])

                        .then( (result) => {
                            for(let i = 0; i < result.rows.length; i++){
                                collections
                                    .push({
                                        rowid: result.rows.item(i).rowid,
                                        email: result.rows.item(i).email,
                                        fullname: result.rows.item(i).fullname,
                                        password: result.rows.item(i).password,
                                        gender: result.rows.item(i).gender,
                                        description: result.rows.item(i).description,
                                        pictureURL: result.rows.item(i).pictureURL
                                    });
                            }
                            resolve(collections);
                        })
                        .catch( (e) => {  alert('SELECT_ERROR2 ' + JSON.stringify(e)); reject(/*new Error(e)*/); });

                    } else {
                        collections = [];
                        resolve(collections);
                    }

                 })
                .catch( (e) => { /*alert('SELECT_ERROR1 ' + JSON.stringify(e) )*/ });
            
            })
            .catch( (e)=> { alert('DB_CONN_ERROR_GET ' + JSON.stringify(e)); reject(/*new Error(e)*/); });
        
        });
    }
    
    showUser(rowid){
        return new Promise((resolve, reject)=>{
            this.sqlite.create({
                name: 'prototype.db',
                location: 'default'
            })
            .then( (db: SQLiteObject) => {
                db.executeSql(`SELECT rowid, email, fullname, password, gender, description, pictureURL
                               FROM users
                               WHERE rowid = ?`, 
                               [rowid] )

                .then( (result) => { resolve( result.rows.item(0) ) })
                    
                .catch( (e) => { alert('SHOW_ERROR ' + JSON.stringify(e)); reject(new Error(e)); });
            
            })
            .catch( (e)=> { alert('DB_CONN_ERROR_SHOW ' + JSON.stringify(e)); reject(new Error(e)); });
        });
    }

    deleteUser(rowid){
        return new Promise( (resolve, reject)=>{
        
            this.sqlite.create({
                name: 'prototype.db',
                location: 'default'
            })
            .then( (db: SQLiteObject) => {
                db.executeSql(`DELETE
                                FROM users
                                WHERE rowid = ?`, 
                                [rowid] )
                .then( (result) => { 
                    resolve();
                })
                    
                .catch( (e) => { 
                    alert('DELETE_ERROR ' + JSON.stringify(e))
                    reject( JSON.stringify(e) );
                });
            })
            .catch( (e)=> { 
                alert('DB_CONN_ERROR_DELETE ' + JSON.stringify(e)) 
                reject( JSON.stringify(e) );
            });
        });
    }

    updateUser(rowid, formData){
        return new Promise( (resolve, reject) => {

            this.sqlite.create({
                name: 'prototype.db',
                location: 'default'
            })
            .then( (db: SQLiteObject) => {
                db.executeSql(`UPDATE users
                                SET email = ?,
                                    fullname = ?,
                                    password = ?,
                                    gender = ?,
                                    description = ?,
                                    pictureURL = ?
                                WHERE rowid = ?`, 
                                [
                                    formData['email'],
                                    formData['fullname'],
                                    formData['password'],
                                    formData['gender'],
                                    formData['description'],
                                    formData['pictureURL'],
                                    rowid
                                ] )

                .then( (result) => { 
                    resolve(
                        {
                            email: formData['email'],
                            fullname: formData['fullname'],
                            password: formData['password'],
                            gender: formData['gender'],
                            description: formData['description'],
                            pictureURL: formData['pictureURL'],
                            rowid: rowid
                        }
                    );
                })
                .catch( (e) => { 
                    alert('UPDATE_ERROR ' + JSON.stringify(e));
                    reject();
                });
            })

            .catch( (e)=> { 
                alert('DB_CONN_ERROR_UPDATE ' + JSON.stringify(e));
                reject();
            });
        });
    }
}