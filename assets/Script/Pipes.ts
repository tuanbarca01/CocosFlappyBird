import { _decorator, Component, Vec3, EventKeyboard, KeyCode, input, Input, randomRange } from 'cc';
import { BirdControl } from './BirdControl'; 
const { ccclass, property } = _decorator;
@ccclass('Pipes') 
export class Pipes extends Component {
    Pipe1X: number;
    speedPipe: number = 6;

    onLoad () {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    onDestroy () {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    }
    onKeyDown (event: EventKeyboard) { //Điều khiển thời giann
        switch(event.keyCode) {
            case KeyCode.ARROW_DOWN:
                this.speedPipe = 3;
                
        }
        this.scheduleOnce(function(){
            if(this.speedPipe != 6){
                this.speedPipe +=3 ;
            }
        },1)
    }
    // onKeyUp (event: EventKeyboard) {
    //     switch(event.keyCode) {
    //         case KeyCode.ARROW_UP:
    //         case KeyCode.ARROW_DOWN:
    //             break;
    //     }
    // } 
    update(delta: number){ 
        let pipeX = this.node.position.x; 
        let pipeY = this.node.position.y; 
        pipeX -= this.speedPipe; 
        this.node.position = new Vec3(pipeX,pipeY);

        if(this.node.getPosition().x < -540){
            this.node.setPosition(703.266, randomRange(-100, 130), 0);
        }
    } 
}


