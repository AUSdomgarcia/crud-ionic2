import { Injectable } from '@angular/core';

@Injectable()

export class DeviceSettings {
    hasPlatform = false;
    platformRef;

    constructor(){}

    add(platform){
       const customHeight = platform.height() - ( platform.height() * 0.35 ); 
       platform.height = () => { return customHeight };
       this.platformRef = platform;
       this.hasPlatform = true;
    }
    
    getPlatform(){
        if(this.hasPlatform){
            return this.platformRef;
        }
        const webScreen = {
            width: () => { return window.innerWidth },
            height: () => { return window.innerHeight - (window.innerHeight * 0.35) }
        };
        return this.platformRef = webScreen;
    }
}