import { DeviceSettings } from '../../shared/shared';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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

  sprite;
  app;

  bgContainer;
  cakeVarianceContainer;
  messageContainer;
  currentTab = 1;

  items = [];

  cakes = [
    {
      name: 'Caramel',
      img: 'assets/cakemaker/variance1.png',
      type: 'variant'
    },
    {
      name: 'Chocolate',
      img: 'assets/cakemaker/variance2.png',
      type: 'variant'
    },
    {
      name: 'Milk',
      img: 'assets/cakemaker/variance3.png',
      type: 'variant'
    },
    {
      name: 'Coffee',
      img: 'assets/cakemaker/variance4.png',
      type: 'variant'
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
      img: 'assets/cakemaker/messages/hmd.png',
      type: 'message'
    },
    {
      name: 'Birthday',
      img: 'assets/cakemaker/messages/hbd.png',
      type: 'message'
    }
  ]



  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private deviceSettings: DeviceSettings) {
      this.items = this.cakes;
    }

  ionViewDidLoad() {
    console.log(this.sprite, this.app);
    const platform = this.deviceSettings.getPlatform();

    if( ! this.app){
    this.app = new PIXI.Application({ 
                            width: platform.width(), 
                            height: platform.height(),
                            preserveDrawingBuffer: true,
                            backgroundColor: 0xffffff 
                          });

    const cc = document.getElementById('canvas-container');
          cc.appendChild(this.app.view);

    // Define Containers
    this.bgContainer = new PIXI.Container();
    this.cakeVarianceContainer = new PIXI.Container();
    this.messageContainer = new PIXI.Container();

    // PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
    this.sprite = PIXI.Sprite.fromImage('assets/cakemaker/base.jpg');
    let ratio =  (platform.width() / this.sprite.width);

    this.sprite.width = this.sprite.width * ratio;
    this.sprite.height = 250;
    this.sprite.anchor.set(0.5);

    this.bgContainer.x = this.app.renderer.width / 2;
    this.bgContainer.y = this.app.renderer.height / 2;
    this.bgContainer.addChild(this.sprite);

    this.cakeVarianceContainer.x = this.app.renderer.width / 2;
    this.cakeVarianceContainer.y = (this.app.renderer.height / 2) - 40;

    this.messageContainer.x = this.app.renderer.width / 2;
    this.messageContainer.y = (this.app.renderer.height / 2) - 100;

    // Layers
    this.app.stage.addChild(this.bgContainer);
    this.app.stage.addChild(this.cakeVarianceContainer);
    this.app.stage.addChild(this.messageContainer);

    // this.sprite.interactive = true;
    // this.sprite.buttonMode = true;
    // this.sprite.on('pointerdown', this.toggleScaleBunny.bind(this));
    }
  }

  // toggleScaleBunny(){
  //   this.sprite.scale.x *= 1.25;
  //   this.sprite.scale.y *= 1.25;
  // }

  ionViewDidLeave(){
    if(typeof this.app.stop === 'function'){
      this.app.stop();
      this.app.destroy(true);
    }
  }

  toggleSelectItem(item){
    console.log(item);
    
    
    switch(item.type){
      case 'variant':
      let cakeSprite = PIXI.Sprite.fromImage(item.img);
        cakeSprite.anchor.set(0.5);
        // TODO: Scale it proportionally
        cakeSprite.height = 200;
        cakeSprite.width = 200;
        this.cakeVarianceManager(cakeSprite);
      break;

      case 2:
        //
      break;

      case 'message':
        let message = PIXI.Sprite.fromImage(item.img);
          message.anchor.set(0.5);
          // TODO: Scale it proportionally
          message.height = 90;
          message.width = 90;
          this.messageManager(message);
      break;
    }
  }

  toggleToURL(){
    console.log(JSON.stringify(this.app.renderer.view.toDataURL()));
  }

  cakeVarianceManager(cakeSprite){
    if(this.cakeVarianceContainer.children.length !== 0){
      this.cakeVarianceContainer.removeChildAt(0);
      this.cakeVarianceContainer.addChildAt(cakeSprite,0);
    } else {
      this.cakeVarianceContainer.addChildAt(cakeSprite, 0);
    }
  }

  messageManager(message){
    if(this.messageContainer.children.length !== 0){
      this.messageContainer.removeChildAt(0);
      this.messageContainer.addChildAt(message,0);
    } else {
      this.messageContainer.addChildAt(message, 0);
    }
  }

  toggleActive(tabId){
    this.currentTab = tabId;
    
    switch(tabId){
      case 1:
        this.items = this.cakes;
      break;

      case 2:
        //
      break;

      case 3:
        this.items = this.messages;
      break;
    }
  }
  
}
