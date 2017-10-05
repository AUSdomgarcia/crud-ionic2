import { ViewChild } from '@angular/core';
import { DeviceSettings, CakeCreatorSettings } from '../../shared/shared';
import { Component } from '@angular/core';
import {
    Events,
    IonicPage,
    LoadingController,
    NavController,
    NavParams,
    Slides,
    ToastController
} from 'ionic-angular';
import * as PIXI from 'pixi.js';


/**
 * Generated class for the CakeCreatorPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-cake-creator',
  templateUrl: 'cake-creator.html',
})

export class CakeCreatorPage {

  @ViewChild(Slides) slides: Slides;

  baseImg;
  app;

  bgContainer;
  cakeContainer;
  messageContainer;
  candleContainer;

  currentTab = 1;

  items = [];

  cakes = [
    {
      name: 'Caramel',
      img: 'assets/cakemaker/variance1.png',
      type: 'cake'
    },
    {
      name: 'Chocolate',
      img: 'assets/cakemaker/variance2.png',
      type: 'cake'
    },
    {
      name: 'Milk',
      img: 'assets/cakemaker/variance3.png',
      type: 'cake'
    },
    {
      name: 'Coffee',
      img: 'assets/cakemaker/variance4.png',
      type: 'cake'
    }
  ];

  messages = [
    {
      name: 'Fathers day',
      img: 'assets/cakemaker/messages/hfd.png',
      type: 'message'
    },
    {
      name: 'Mothers day',
      img: 'assets/cakemaker/messages/_hmd.png',
      type: 'message'
    },
    {
      name: 'Birthday',
      img: 'assets/cakemaker/messages/hbd.png',
      type: 'message'
    }
  ];

  candles = [
    {
      name: '2 Candles',
      img: 'assets/cakemaker/candles/001.png',
      type: 'candle'
    },
    {
      name: '3 Candles',
      img: 'assets/cakemaker/candles/002.png',
      type: 'candle'
    },
    {
      name: '6 Candles',
      img: 'assets/cakemaker/candles/003.png',
      type: 'candle'
    },
  ];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private deviceSettings: DeviceSettings,
    private cakeCreatorSettings: CakeCreatorSettings,
    private toastCtrl: ToastController,
    private events: Events,
    private loadingCtrl: LoadingController) {
      this.items = this.cakes;
    }

  ionViewDidLoad() {
    console.log('Loaded cakeCreator');

    const platform = this.deviceSettings.getPlatform();

    if( ! this.app){
    this.app = new PIXI.Application({ 
                            width: platform.width(), 
                            height: platform.height(),
                            preserveDrawingBuffer: true,
                            backgroundColor: 0xffffff 
                          });

    let markup = document.getElementById('canvas-container');
        markup.appendChild(this.app.view);

    // Define Containers
    this.bgContainer = new PIXI.Container();
    this.cakeContainer = new PIXI.Container();
    this.messageContainer = new PIXI.Container();
    this.candleContainer = new PIXI.Container();

    // PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
    this.baseImg = PIXI.Sprite.fromImage('assets/cakemaker/base.jpg');
    let ratio =  (platform.width() / this.baseImg.width);

    this.baseImg.width = this.baseImg.width * ratio;
    this.baseImg.height = 250;
    this.baseImg.anchor.set(0.5);

    // Items
    this.bgContainer.x = this.app.renderer.width / 2;
    this.bgContainer.y = this.app.renderer.height / 2;

    this.cakeContainer.x = this.app.renderer.width / 2;
    this.cakeContainer.y = (this.app.renderer.height / 2) - 40;

    this.messageContainer.x = this.app.renderer.width / 2;
    this.messageContainer.y = (this.app.renderer.height / 2) - 20;

    this.candleContainer.x = this.app.renderer.width / 2;
    this.candleContainer.y = (this.app.renderer.height / 2) - 140;

    // Layers
    this.bgContainer.addChild(this.baseImg);
    this.app.stage.addChild(this.bgContainer);
    this.app.stage.addChild(this.cakeContainer);
    this.app.stage.addChild(this.candleContainer);
    this.app.stage.addChild(this.messageContainer);

    // this.sprite.interactive = true;
    // this.sprite.buttonMode = true;
    // this.sprite.on('pointerdown', this.toggleScaleBunny.bind(this));
    }
  }

  ionViewDidLeave(){
    /* 
    console.log('is_leaving');
    if(this.navCtrl.getActive().name === 'CakeCreatorPage' && this.app !== null) {
      if(typeof this.app.stop === 'function' ){
        this.app.stop();
        this.app.destroy(true);
        this.app = null;
      }
    }
    */
  }

  garbageCollect(){
    /*
    console.log('calling gb ', this.app);
    if(this.app){
      if(typeof this.app.stop === 'function' ){
        this.app.stop();
        this.app.destroy(true);
        this.app = null;

        console.log(this.app);
      }
    }
    */
  }
  
  toggleSelectItem(item){

    switch(item.type){
      case 'cake':
      let cake = PIXI.Sprite.fromImage(item.img);
        cake.anchor.set(0.5);
        cake.height = 200;
        cake.width = 200;
        this.childrenManager(cake, this.cakeContainer);
      break;

      case 'candle':
        let candle = PIXI.Sprite.fromImage(item.img);
            candle.anchor.set(0.5);
            candle.height = 100;
            candle.width = 100;
            this.childrenManager(candle, this.candleContainer);
      break;

      case 'message':
        let message = PIXI.Sprite.fromImage(item.img);
          message.anchor.set(0.5);
          message.height = 150;
          message.width = 150;
          this.childrenManager(message, this.messageContainer);
      break;
    }
  }

  toggleToURL(){
    let loading = this.loadingCtrl.create({
      content: 'Saving entry...'
    });

    loading.present();

    this.cakeCreatorSettings
        .saveEntry(this.app.renderer.view.toDataURL())
        .then( () => {

          loading.dismiss();

          this.events.publish('cake:added');

        })
        .catch( (err) => {
          alert('cake-creator.ts SaveEntry Err ' + JSON.stringify(err))
        });
  }

  childrenManager(children, container){
    if(container.children.length !== 0){
      container.removeChildAt(0);
      container.addChildAt(children,0);
    } else {
      container.addChildAt(children,0);
    }
  }

  toggleActive(tabId){
    // Reset slides to zero index
    let slideActiveIndex = this.slides.getActiveIndex();
    if(slideActiveIndex !== 0){
      this.slides.slideTo(0, 0);
    }

    this.currentTab = tabId;
    
    switch(tabId){
      case 1: this.items = this.cakes; break;
      case 2: this.items = this.candles; break;
      case 3: this.items = this.messages; break;
    }
  }
}
