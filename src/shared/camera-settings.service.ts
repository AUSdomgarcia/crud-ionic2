import { Camera } from '@ionic-native/camera';
import { DirectoryEntry, File } from '@ionic-native/file';
import { Injectable } from '@angular/core';
import { UserSettings } from './user-settings.service';

@Injectable()

export class CameraSettings {

    myStoragePath: string;
    CAMERA: string = 'camera';
    GALLERY: string = 'gallery';
    path;

    constructor(private camera: Camera, 
                private file: File,
                private userSettings: UserSettings){}

    initFileDirectory(platform){
        if(platform.is('ios')){
            //
        }

        if(platform.is('android')){
            this.path = this.file.dataDirectory;
            const UPLOADS_FOLDER = 'uploads';

            this.file.checkDir(this.path, 'uploads')
            .then( () => {
                this.myStoragePath = this.path + UPLOADS_FOLDER;
                this.file.listDir(this.path, UPLOADS_FOLDER)
                    .then( (res) => { 
                        //
                    })
                    .catch( (err) => { alert('EXIST_UPLOADS_ERR ' + JSON.stringify(err) ); } );
            })
            .catch( () => {
                // Initial Creation
                this.file.createDir(this.path, 'uploads', false)
                .then( (res) => { 
                    // alert('CREATED_UPLOAD_DIR ' + JSON.stringify(res));
                    // this.checkIfUploadExists();
                })
                .catch( (err) => { 
                    alert('CREATE_UPLOAD_DIR_ERR ' + JSON.stringify(err));
                });
            });
        }
    }

    checkIfUploadExists(){
        this.file.checkDir(this.path, 'uploads')
            .then( (res) => { alert('IS_UPLOADS_EXISTS_SUC ' + JSON.stringify(res)) })
            .catch( (err) => {  alert('IS_UPLOADS_EXISTS_ERR ' + JSON.stringify(err)) });
    }
    
    useMedia(mediaType: string){
        let opts;
        
        switch(mediaType){
            case this.CAMERA:
                opts = {
                    quality: 100,
                    mediaType: this.camera.MediaType.PICTURE,
                    encodingType: this.camera.EncodingType.JPEG,
                    destinationType: this.camera.DestinationType.FILE_URI,
                    targetWidth: 1000,
                    targetHeight: 1000,
                    correctOrientation: true,
                    allowEdit: true,
                    saveToPhotoAlbum: false
                };
            break;

            case this.GALLERY:
                opts = {
                    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
                    encodingType: this.camera.EncodingType.JPEG,   
                    destinationType: this.camera.DestinationType.FILE_URI, // instead of DATA_URL    
                    quality: 100,
                    targetWidth: 1000,
                    targetHeight: 1000,
                    correctOrientation: true,
                    allowEdit: true,
                    saveToPhotoAlbum: false
                };
            break;
        }

        const getFileEntry = () => {
            // promise
            let promise = new Promise( (resolve, reject) => {
                this.camera.getPicture(opts)
                .then( (cacheURI) => {
                    this.file.resolveLocalFilesystemUrl(cacheURI)
                        .then( (directoryEntry: DirectoryEntry) => {
                            resolve(directoryEntry);
                        })
                        .catch( (err) => {
                            alert('CameraSetting.ts getFileEntry Error ' + JSON.stringify(err));
                            reject(err);
                        });
                })
                .catch( (err) => {
                    reject(err);
                });
            });
            return promise;
        }

        const moveToFile = (fileEntry: DirectoryEntry) => {
            const _extension = '.' + this.getFileExtension(fileEntry.nativeURL);
            const newName = ((mediaType===this.CAMERA) ? 'camera_' : 'gallery_').toString() + this.hashName() + _extension;
            // promise
            let promise = new Promise( (resolve, reject) => {
                this.file.resolveLocalFilesystemUrl( this.file.dataDirectory.toString().concat('uploads') )
                    .then( (res: DirectoryEntry) => {
                        fileEntry.moveTo(
                            res,
                            newName,
                            (success) => { 
                                resolve(success);
                            },
                            (err) => {
                                alert('CameraSetting.ts fileEntry.moveTo Error' + JSON.stringify(err));
                                reject(err);
                            })
                    })
                    .catch( (err) => {
                        alert('CameraSetting.ts moveToFile Error ' + JSON.stringify(err));
                    });
            });
            return promise;
        }

        return getFileEntry().then(moveToFile);
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