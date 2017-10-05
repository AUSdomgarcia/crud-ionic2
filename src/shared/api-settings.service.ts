import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';
import { Helpers } from './shared';

@Injectable()

export class ApiSettings {

    firebase_api;

    private baseUrl = 'https://prototypesyncmodule.firebaseio.com';

    constructor(private http: Http,
                private helpers: Helpers) {
        let config = {
            apiKey: "AIzaSyAAws_4wBh84H4wK24On__b66q3Qx9iSHM",
            authDomain: "prototypesyncmodule.firebaseapp.com",
            databaseURL: "https://prototypesyncmodule.firebaseio.com",
            projectId: "prototypesyncmodule",
            storageBucket: "prototypesyncmodule.appspot.com",
            messagingSenderId: "432874785744"
        };
        this.firebase_api = firebase.initializeApp(config);
    }

    getStudents(){
        return new Promise( (resolve, reject) => {
            this.firebase_api.database().ref('/students')
            .orderByChild('inverted_ts')
            .limitToLast(100) // TODO: pagination
            .once('value', 
                (snap) => {
                    let fixedOrder = {};
                    snap.forEach( (child) => {
                        fixedOrder[child.key] = child.val();
                    });
                    resolve(fixedOrder);
                },
                (err) => {
                    reject(err);
                });
        });
    }

    addStudent(student){
        return new Promise( (resolve, reject) => {
            const timestamp = Date.now();
            const generated_hash_id = this.helpers.toHashName();

            this.firebase_api
                .database()
                .ref('/students')
                .child(generated_hash_id)
                    .set({
                        _id: generated_hash_id,
                        action: 'create', 
                        age: parseInt(student.age), 
                        created_at: timestamp, 
                        information: student.information, 
                        inverted_ts: -1 * timestamp, 
                        level: student.level, 
                        name: student.name, 
                        updated_at: timestamp, 
                    }, 
                    (err) => {
                        if(err){
                            reject(err);
                        } else {
                            resolve('DOMZKIE say YAHOO!');
                        }
                    });
        });
    }

    deleteStudent(id){
        return new Promise( (resolve, reject) => {
            const timestamp = Date.now();

            this.firebase_api
                .database()
                .ref('/students')
                .child(id)
                    .update({
                        'action':'delete',
                        'updated_at': timestamp
                    }, 
                    (err) => {
                        if(err){
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
        });
    }

    checkUpdateByTimestamp(timestamp){
        return new Promise( (resolve, reject) => {
            let end   = Date.now();
            let start = timestamp + 1;
            
            this.firebase_api.database().ref('/students')
            .orderByChild('updated_at')
            .startAt(start)
            .endAt(end)
            .once('value', 
                (snap) => {
                    let fixedOrder = {};
                    snap.forEach( (child) => {
                        fixedOrder[child.key] = child.val();
                    });
                    resolve(fixedOrder);
                },
                (err) => {
                    reject(err);
                });
        });
    }

    updateStudentDetails(student){
        return new Promise( (resolve, reject) => {
            const timestamp = Date.now();
            
           /* alert(
            "id: "+ student._id +
            " name: "+ student.name +
            " age: "+ student.age +
            " info: "+ student.information +
            " level: "+ student.level +
            " up_at: "+ timestamp 
        )*/

            this.firebase_api
                .database()
                .ref('/students')
                .child(student._id)
                    .update({
                        action: 'update',
                        name: student.name,
                        age: student.age,
                        information: (student.information) ? student.information : '',
                        level: student.level,
                        updated_at : timestamp
                    },
                    (err) => {
                        if(err){

                            // alert('PASS_TO_PROMISE_updateStudentDetails ' + JSON.stringify(err));
                            
                            reject(err);

                        } else {

                            // alert('NAG RESOLVED');

                            resolve();
                        }
                    });
        });
    }
}