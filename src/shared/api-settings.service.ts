import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';

@Injectable()

export class ApiSettings {

    firebase_api;

    private baseUrl = 'https://prototypesyncmodule.firebaseio.com';

    constructor(private http: Http) {
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

    checkUpdates(timestamp){
        return new Promise( (resolve, reject) => {
            let end = Date.now();
            let start   = timestamp + 1;
            
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
}