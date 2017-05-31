import { Camera, CameraOptions } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { Injectable } from '@angular/core';
import { UserSettings } from './user-settings.service';

@Injectable()

export class CameraSettings {

    fullPath: string;

    constructor(private camera: Camera, 
                private file: File,
                private userSettings: UserSettings){}

    initFileDirectory(platform){
        if(platform.is('ios')){
            //
        }

        if(platform.is('android')){
            let path = this.file.dataDirectory;
            const UPLOADS_FOLDER = 'uploads';

            this.file.checkDir(path, 'uploads')

            .then( () => {
                this.fullPath = path + UPLOADS_FOLDER;
                alert(this.fullPath);
                // List files inside uploads folder
                this.file.listDir(path, UPLOADS_FOLDER)
                    .then( (res) => { 
                        // alert('EXIST_UPLOADS_FILES ' 
                        // + JSON.stringify(res) ); 
                    })
                    .catch( (err) => { alert('EXIST_UPLOADS_ERR ' + JSON.stringify(err) ); } );
            })

            .catch( () => {
                // Initial Creation
                this.file.createDir(path, 'uploads', false)
                .then( (res) => { 
                    alert('CREATED_UPLOAD_DIR ' + JSON.stringify(res));
                })
                .catch( (err) => { 
                    alert('CREATE_UPLOAD_DIR_ERR ' + JSON.stringify(err));
                })
            });
        }
    }
    
    useGallery(){
        return new Promise((resolve, reject) => {
            //////////////
            let opts = {
                sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
                encodingType: this.camera.EncodingType.JPEG,   
                destinationType: this.camera.DestinationType.FILE_URI, // instead of DATA_URL    
                quality: 100,
                targetWidth: 100,
                targetHeight: 100,
                correctOrientation: true,
                allowEdit: true
            };
            this.camera.getPicture(opts)
                .then( 
                (uri) => {
                    const _extension = '.' + this.getFileExtension(uri);
                    const path = uri.substring(0, uri.lastIndexOf('/') + 1);
                    const name = this.getFileName(uri) + _extension;
                    const newPath = this.fullPath + '/';
                    const newName = 'gallery_' + this.hashName() + _extension;

                    this.file.copyFile(path, name, newPath, newName)
                    .then( (res) => {
                        resolve(res.nativeURL);
                    })
                    .catch( (err) => {
                        alert('COPY_FILE_GALLERY_ERR ' + JSON.stringify(err));
                        reject(err);
                    });
                }, 
                (err) => {
                    // alert('GALLERY_REJECTED ' + JSON.stringify(err));
                    // Sendings action gallery were cancelled
                    reject(err);
                })
            //////////////
        });
    }

    useCamera(){
        return new Promise( (resolve, reject) => {
            //////////
            const opts: CameraOptions = {
                quality: 100,
                // destinationType: this.camera.DestinationType.DATA_URL,
                mediaType: this.camera.MediaType.PICTURE,
                encodingType: this.camera.EncodingType.JPEG,
                destinationType: this.camera.DestinationType.FILE_URI,
                allowEdit: true,
                targetWidth: 100,
                targetHeight: 100,
                correctOrientation: true,
                saveToPhotoAlbum: false
            };

            this.camera.getPicture(opts).then((uri) => {
                const _extension = '.' + this.getFileExtension(uri);
                const path = uri.substring(0, uri.lastIndexOf('/') + 1);
                const name = this.getFileName(uri) + _extension;
                const newPath = this.fullPath + '/';
                const newName = 'camera_' + this.hashName() + _extension;
                
                this.file.copyFile(path, name, newPath, newName)
                    .then( (res) => {
                        resolve(res.nativeURL);
                    })
                    .catch( (err) => {
                        alert('COPY_FILE_CAMERA_ERR ' + JSON.stringify(err));
                        reject(err);
                    });

                }, (err) => {
                    // alert('USE_CAMERA_PROMISE_ERR ' + JSON.stringify(err));
                    // Sending action that camera were cancelled.
                    reject(err);
                });
            //////////
        });
    }

    toBase64(uri){
        const path = uri.substring(0, uri.lastIndexOf('/') + 1);
        const filename = this.getFileName(uri) + '.' + this.getFileExtension(uri);
        return this.file.readAsDataURL(path, filename);
    }
    
    hashName(): string {
        let chars = '';
        let limit = 8;
        let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (var i=0; i < limit; i++) {
            chars += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return chars;
    }

    getFileExtension = function(url) {
        return url.split('.').pop().split(/\#|\?/)[0];
    }

    getFileName(url) {
        if (url) {
            var m = url.toString().match(/.*\/(.+?)\./);
            if (m && m.length > 1) {
                return m[1];
            }
        }
        return '';
    }
}

// imageData is either a base64 encoded string or a file URI
// If it's base64:
// let base64Image = 'data:image/jpeg;base64,' + imageData;
// alert('[URI]: ' + uri +
//      ' [FileName]: ' + this.getFileName(uri) +
//      ' [MyPath]: ' + this.fullPath);
// alert('[Extension] ' + this.getFileExtension(uri));
