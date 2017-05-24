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
                alert('truncate sql successfully') ;
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
                alert('Drop sql successfully') ;
            })
            .catch( (e) => alert('DROP_ERROR ' + JSON.stringify(e)) );
        })
        .catch( (e)=> { alert('DB_CONN_ERROR ' + JSON.stringify(e)) });
    }

    initSQLite(){
        // this.dropTable();

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
                    .then(() => alert('executed sql successfully!') )
                    .catch( (e) => alert('CREATE_ERROR ' + JSON.stringify(e)) );
        })
        .catch( (e)=> { alert('DB_CONN_ERROR ' + JSON.stringify(e)) });
    }

    addUser(formData){
        this.sqlite.create({
            name: 'prototype.db',
            location: 'default'
        })
        .then( (db: SQLiteObject) => {
            db.executeSql(
                    `INSERT INTO users
                     VALUES (?,?,?,?,?)`,
                     [
                        formData['email'],
                        formData['fullname'],
                        formData['password'],
                        formData['gender'],
                        formData['description']
                    ])
                    .then(() => {
                        this.events.publish('user:added');
                    })
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
                .then( (result) => {
                    for(let i = 0; i < result.rows.length; i++){
                        collections
                            .push({
                                email: result.rows.item(i).email,
                                fullname: result.rows.item(i).fullname,
                                password: result.rows.item(i).password,
                                gender: result.rows.item(i).gender,
                                description: result.rows.item(i).description
                            });
                    }
                    resolve(collections);
                })
                .catch( (e) => { alert('SELECT_ERROR ' + JSON.stringify(e)); reject(new Error(e)); });
            })
            .catch( (e)=> { alert('DB_CONN_ERROR ' + JSON.stringify(e)); reject(new Error(e)); });
        });
    }
}
