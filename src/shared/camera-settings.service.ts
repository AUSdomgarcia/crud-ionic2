import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';


@Injectable()

export class CameraSettings {

    imageSrc: any;

    constructor(private camera: Camera){}

    useGallery(){
        let cameraOptions = {
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
            destinationType: this.camera.DestinationType.FILE_URI,      
            quality: 100,
            targetWidth: 1000,
            targetHeight: 1000,
            encodingType: this.camera.EncodingType.JPEG,      
            correctOrientation: true
        }

        this.camera.getPicture(cameraOptions)
        
            .then(file_uri => this.imageSrc = file_uri, 

            err => alert('GALLERY_REJECTED ' + JSON.stringify(err)))

            .catch(e => alert('GALLERY_ERR ' + JSON.stringify(e) ) );   
    }

    useCamera(){
        const options: CameraOptions = {
            quality: 100,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE
        }

        this.camera.getPicture(options).then((imageData) => {
            // imageData is either a base64 encoded string or a file URI
            // If it's base64:
            let base64Image = 'data:image/jpeg;base64,' + imageData;
        }, (err) => {
            // Handle error
        });
    }
}