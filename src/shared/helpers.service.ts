import { File } from '@ionic-native/file';
import { Injectable } from '@angular/core';

@Injectable()

export class Helpers {

    constructor(private file: File){
        // init
    }
    
    toBase64(uri){
        const path = uri.substring(0, uri.lastIndexOf('/') + 1);
        const filename = this.toFileName(uri) + '.' + this.toFileExtension(uri);
        return this.file.readAsDataURL(path, filename);
    }

    toHashName(): string {
        let chars = '';
        let limit = 8;
        let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (var i=0; i < limit; i++) {
            chars += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return chars;
    }

    toFileExtension = function(url) {
        return url.split('.').pop().split(/\#|\?/)[0];
    }

    toFileName(url) {
        if (url) {
            var m = url.toString().match(/.*\/(.+?)\./);
            if (m && m.length > 1) {
                return m[1];
            }
        }
        return '';
    }
}