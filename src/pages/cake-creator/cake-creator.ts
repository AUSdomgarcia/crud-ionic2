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

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams) {}

  ionViewDidLoad() {

    console.log(this.sprite, this.app);

    if( ! this.app){
    this.app = new PIXI.Application(320, 320, { backgroundColor: 0x1099bb });

    const cc = document.getElementById('canvas-container');
          cc.appendChild(this.app.view);

    // PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
    this.sprite = PIXI.Sprite.fromImage('assets/uploads/bunny.png');

    this.sprite.anchor.set(0.5);
    this.sprite.x = this.app.renderer.width / 2;
    this.sprite.y = this.app.renderer.height / 2;

    this.sprite.interactive = true;
    this.sprite.buttonMode = true;

    this.sprite.on('pointerdown', this.toggleScaleBunny.bind(this));
    this.app.stage.addChild(this.sprite);
    }
  }

  ionViewDidLeave(){
    if(typeof this.app.stop === 'function'){
      this.app.stop();
      this.app.destroy(true);   
    }
  }

  toggleScaleBunny(){
    this.sprite.scale.x *= 1.25;
    this.sprite.scale.y *= 1.25;
  }
}
