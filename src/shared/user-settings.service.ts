import { Events } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@Injectable()

export class UserSettings {

    constructor(private sqlite: SQLite, private events:Events ){}

    truncateDB(){
        this.sqlite.create({
            name: 'prototype.db',
            location: 'default'
        })
        .then( (db: SQLiteObject) => {
            db.executeSql(`DELETE FROM users`, [])
            .then(() => {
                alert('truncate sql successfully');
            })
            .catch( (e) => alert('TRUNC_ERROR ' + JSON.stringify(e)) );
        })
        .catch( (e)=> { alert('DB_CONN_ERROR ' + JSON.stringify(e)) });
    }

    dropTable(){
        this.sqlite.create({
            name: 'prototype.db',
            location: 'default'
        })
        .then( (db: SQLiteObject) => {
            db.executeSql(`DROP TABLE users`, [])
            .then(() => {
                alert('Drop sql successfully');
            })
            .catch( (e) => { alert('DROP_ERROR ' + JSON.stringify(e)) } );
        })
        .catch( (e)=> { alert('DB_CONN_ERROR ' + JSON.stringify(e)) });
    }
    
    initSQLite(isNative){
        // this.truncateDB();

        if(isNative){
            this.sqlite.create({
                name: 'prototype.db',
                location: 'default'
            })
            .then( (db: SQLiteObject) => {
                db.executeSql(
                        `CREATE TABLE IF NOT EXISTS users (
                            email TEXT NOT NULL,
                            fullname TEXT NOT NULL,
                            password TEXT NOT NULL,
                            gender TEXT NOT NULL,
                            description TEXT NOT NULL
                        )`, [])

                        .then(() => { alert('NATIVE sql successfully!') })

                        .catch( (e) => alert('CREATE_ERROR ' + JSON.stringify(e)) );
            })
            .catch( (e)=> { alert('DB_CONN_ERROR' + JSON.stringify(e)) });
        }
        
        if(!isNative){
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
        this.sqlite.create({
            name: 'prototype.db',
            location: 'default'
        })
        .then( (db: SQLiteObject) => {
            db.executeSql(
                    `INSERT INTO users VALUES (?, ?, ?, ?, ?)`,
                     [
                        formData['email'],
                        formData['fullname'],
                        formData['password'],
                        formData['gender'],
                        formData['description']
                    ])

                    .then(() => { this.events.publish('user:added') })
                    
                    .catch( (e) => alert('CREATE_ERROR ' + JSON.stringify(e)) );
        })
        .catch( (e)=> { alert('DB_CONN_ERROR ' + JSON.stringify(e)) });
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
                    if(res.rows.length !== 0){
                        
                        db.executeSql(`SELECT rowid, email, fullname, password, gender, description
                                        FROM users`, [])

                        .then( (result) => {
                            for(let i = 0; i < result.rows.length; i++){
                                
                                // alert( JSON.stringify(result.rows.item(i)) );
                                
                                collections
                                    .push({
                                        rowid: result.rows.item(i).rowid,
                                        email: result.rows.item(i).email,
                                        fullname: result.rows.item(i).fullname,
                                        password: result.rows.item(i).password,
                                        gender: result.rows.item(i).gender,
                                        description: result.rows.item(i).description
                                    });
                            }
                            resolve(collections);
                        })
                        .catch( (e) => {  alert('SELECT_ERROR ' + JSON.stringify(e)); reject(new Error(e)); });

                    } else {
                        resolve(collections);
                    }

                 })
                .catch( (e) => { alert('SELECT_ERROR ' + JSON.stringify(e) ) });
            
            })
            .catch( (e)=> { alert('DB_CONN_ERROR ' + JSON.stringify(e)); reject(new Error(e)); });
        
        });
    }
    
    showUser(rowid){
        return new Promise((resolve, reject)=>{
            this.sqlite.create({
                name: 'prototype.db',
                location: 'default'
            })
            .then( (db: SQLiteObject) => {
                db.executeSql(`SELECT rowid, email, fullname, password, gender, description
                               FROM users
                               WHERE rowid = ?`, 
                               [rowid] )

                .then( (result) => { resolve( result.rows.item(0) ) })
                    
                .catch( (e) => { alert('SHOW_ERROR ' + JSON.stringify(e)); reject(new Error(e)); });
            
            })
            .catch( (e)=> { alert('DB_CONN_ERROR ' + JSON.stringify(e)); reject(new Error(e)); });
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
                    this.events.publish('user:deleted');
                    resolve();
                })
                    
                .catch( (e) => { 
                    alert('SHOW_ERROR ' + JSON.stringify(e))
                    reject( JSON.stringify(e) );
                });
            })
            .catch( (e)=> { 
                alert('DB_CONN_ERROR ' + JSON.stringify(e)) 
                reject( JSON.stringify(e) );
            });
        });
    }

    updateUser(rowid, formData){
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
                                description = ?
                            WHERE rowid = ?`, 
                            [
                                formData['email'],
                                formData['fullname'],
                                formData['password'],
                                formData['gender'],
                                formData['description'],
                                rowid
                            ] )

            .then( (result) => { 
                this.events.publish('user:updated');
            })
            .catch( (e) => { 
                alert('UPDATE_ERROR ' + JSON.stringify(e))
            });
        })

        .catch( (e)=> { 
            alert('DB_CONN_ERROR ' + JSON.stringify(e)) 
        });
    }
}