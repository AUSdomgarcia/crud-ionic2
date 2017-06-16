import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs';
import { Observable } from 'rxjs/Observable';

@Injectable()

export class ApiSettings {

    private baseUrl = 'https://prototypesyncmodule.firebaseio.com/';

    constructor(private http: Http) {
        //
    }

    getStudents(){
        return new Promise( (resolve, reject) => {
            this.http.get(`${this.baseUrl}/prototypesyncmodule.json`)
                     .subscribe( (res) => {
                        resolve(res.json());
                     });
        });
    }
}