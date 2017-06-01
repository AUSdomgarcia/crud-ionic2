import { Camera, CameraOptions } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { Injectable } from '@angular/core';
import { UserSettings } from './user-settings.service';
import Bluebird from 'bluebird';

@Injectable()

export class CameraSettings {

    myStoragePath: string;
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
                // alert('CAMERA_SETTING_ERR ' + this.myStoragePath);
                // List files inside uploads folder
                this.file.listDir(this.path, UPLOADS_FOLDER)
                    .then( (res) => { 
                        // alert('EXIST_UPLOADS_FILES ' 
                        // + JSON.stringify(res) ); 
                    })
                    .catch( (err) => { alert('EXIST_UPLOADS_ERR ' + JSON.stringify(err) ); } );
            })

            .catch( () => {
                // Initial Creation
                this.file.createDir(this.path, 'uploads', false)
                .then( (res) => { 
                    alert('CREATED_UPLOAD_DIR ' + JSON.stringify(res));

                    this.checkIfUploadExists();
                })
                .catch( (err) => { 
                    alert('CREATE_UPLOAD_DIR_ERR ' + JSON.stringify(err));
                })
            });
        }
    }

    checkIfUploadExists(){
        this.file.checkDir(this.path, 'uploads')
            .then( (res) => { alert('IS_UPLOADS_EXISTS_SUC ' + JSON.stringify(res)) })
            .catch( (err) => {  alert('IS_UPLOADS_EXISTS_ERR ' + JSON.stringify(err)) });
    }
    
    useGallery(){
        return new Promise((resolve, reject) => {
            //////////////
            let opts = {
                sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
                encodingType: this.camera.EncodingType.JPEG,   
                destinationType: this.camera.DestinationType.FILE_URI, // instead of DATA_URL    
                quality: 100,
                targetWidth: 200,
                targetHeight: 200,
                correctOrientation: true,
                allowEdit: true,
                saveToPhotoAlbum: false
            };

            this.camera.getPicture(opts)
                .then( 
                (uri) => {
                    const _extension = '.' + this.getFileExtension(uri);
                    const path = uri.substring(0, uri.lastIndexOf('/') + 1);
                    const name = this.getFileName(uri) + _extension;
                    const newPath = this.myStoragePath;
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
        // # 1
        // const getURI = ()  => {
            const opts: CameraOptions = {
                quality: 100,
                mediaType: this.camera.MediaType.PICTURE,
                encodingType: this.camera.EncodingType.JPEG,
                destinationType: this.camera.DestinationType.FILE_URI,
                targetWidth: 200,
                targetHeight: 200,
                correctOrientation: true,
                allowEdit: true,
                saveToPhotoAlbum: false
            };

            // let promise = new Bluebird( (resolve, reject) => {
             return this.camera.getPicture(opts)
                    // .then( (uri) => {
                        // resolve(uri);
                    // })
                    // .catch( (err) => { 
                        // alert('GET_URI_CAMERA_ERR ' + JSON.stringify(err));
                        // reject(err);
                    // });
            // });

            // return promise;
        // }

        // return getURI();
    }
        
    // # 2
    // const moveFile = (uri) => {
    //     console.log('^^^^ ' +  uri);
    //     const _extension = '.' + this.getFileExtension(uri);
    //     const _name = this.getFileName(uri) + _extension;
    //     const _newPath = this.myStoragePath;
    //     const _newName = 'camera_' + this.hashName() + _extension;
    //     const _uri = uri.substring(0, uri.lastIndexOf('/') + 1);
    //     let promise = new Bluebird( (resolve, reject) => {
    //         this.file.moveFile(_uri, _name, _newPath, _newName)
    //         .then( _ => {
    //             alert('ENTRY: ' + JSON.stringify(_));
    //             resolve( _.nativeURL );
    //         })
    //         .catch((err) => {
    //             alert('COPY_FILE_CAMERA_ERR ' + JSON.stringify(err));
    //             reject(err);
    //         });
    //     });
    //     return promise;
    // }
    // # 3
    // return getURI().then(moveFile)

    moveFileToStorage(uri) {
        const _extension = '.' + this.getFileExtension(uri);
        const _name = this.getFileName(uri) + _extension;
        const _newPath = this.myStoragePath;
        const _newName = 'camera_' + this.hashName() + _extension;
        const _uri = uri.substring(0, uri.lastIndexOf('/') + 1);

        return this.file.copyFile(_uri, _name, _newPath, _newName);
    }

    //  const moveFile = (uri) => {
    //     let promise = new Bluebird( (resolve, reject) => {
    //         this.file.moveFile(_uri, _name, _newPath, _newName)
    //         .then( _ => {
    //             alert('STORED: ' + JSON.stringify(_));
    //             resolve(_.nativeURL);
    //         })
    //         .catch((err) => {
    //             alert('COPY_FILE_CAMERA_ERR ' + JSON.stringify(err));
    //             reject(err);
    //         });
    //     });
    //     return promise;
    // }
    // return moveFile(uri);

    useCamera1(){
        return new Promise( (resolve, reject) => {
            //////////
            const opts: CameraOptions = {
                quality: 100,
                // destinationType: this.camera.DestinationType.DATA_URL,
                mediaType: this.camera.MediaType.PICTURE,
                encodingType: this.camera.EncodingType.JPEG,
                destinationType: this.camera.DestinationType.FILE_URI,
                // allowEdit: true,
                targetWidth: 200,
                targetHeight: 200,
                correctOrientation: true,
                saveToPhotoAlbum: false
            };

            this.camera.getPicture(opts).then((uri) => {

                const _uri = uri.substring(0, uri.lastIndexOf('/') + 1);
                alert('WITH_FILE ' + uri + ' W/o_FILE ' + _uri);

                ///////////////////////
                // this.file.resolveDirectoryUrl(_uri)
                // .then( (res) => { alert('resolveDirectoryUrl_SUC ' + JSON.stringify(res)) })
                // .catch( (err) => { alert('resolveDirectoryUrl_ERR ' + JSON.stringify(err) ) });
                // this.file.resolveLocalFilesystemUrl(_uri)
                // .then( (res) => { alert('resolveLocalFilesystemUrl_SUC ' + JSON.stringify(res)) })
                // .catch( (err) => { alert('resolveLocalFilesystemUrl_ERR ' + JSON.stringify(err) ) });
                ///////////////////////

                const _extension = '.' + this.getFileExtension(uri);
                const _name = this.getFileName(uri) + _extension;
                const _newPath = this.myStoragePath;
                const _newName = 'camera_' + this.hashName() + _extension;
                
                ///////////////////////
                // this.file.checkDir(this.path, 'uploads')
                //     .then( (res) => {
                //         alert('CAMERA_CHECKDIR_SUCC ' + JSON.stringify(res)); 
                //     })
                //     .catch( (err) => { alert('CAMERA_CHECKDIR_ERR ' + JSON.stringify(err)); });
                ///////////////////////

                    this.file.moveFile(_uri, _name, _newPath, _newName)
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
//      ' [MyPath]: ' + this.myStoragePath);
// alert('[Extension] ' + this.getFileExtension(uri));
