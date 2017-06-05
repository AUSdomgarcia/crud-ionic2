import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as PIXI from 'pixi';

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

  bunny;
  renderer;
  stage;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad CakeCreatorPage');
    this.renderer = PIXI.WebGLRenderer(800, 600);
    document.getElementById('canvas-container').appendChild(this.renderer.view);
    
    // this.stage = new PIXI.Stage();
    // let bunnyTexture = PIXI.Texture.fromImage("assets/uploads/user.jpg");
    // this.bunny = new PIXI.Sprite(bunnyTexture);
    
    // this.bunny.position.x = 400;
    // this.bunny.position.y = 300;
    // this.bunny.scale.x = 2;
    // this.bunny.scale.y = 2;
 
    // this.stage.addChild(this.bunny);
    // requestAnimationFrame(this.animate);
  }

  animate(){
    // this.bunny.rotation += 0.01;
    // this.renderer.render(this.stage);
    // requestAnimationFrame(this.animate);
  }
}
