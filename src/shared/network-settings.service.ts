import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network';


@Injectable()

export class NetworkSettings {

    disconnectSubscription;
    connectSubscription;
    hasNetwork = false;
    
    constructor(private network: Network){}

    init(){
        console.log('---init-network---');
        this.setNetwork();
        this.listener();

        // TODO: since runnig on web default set to true
        this.hasNetwork = true;
    }

    setNetwork(){
        if(['wifi','2g','3g','4g','cellular'].indexOf(this.network.type) >= 0){
            this.hasNetwork = true; 
        }
    }

    listener(){
        this.disconnectSubscription = this.network.onDisconnect().subscribe(() => {
            console.log('network was disconnected :-(');
            this.hasNetwork = false;
        });

        this.connectSubscription = this.network.onConnect().subscribe(() => {
            this.hasNetwork = false;
            console.log('network connected!');
        });
    }

    isAvailable() {
        return this.hasNetwork;
    }
}