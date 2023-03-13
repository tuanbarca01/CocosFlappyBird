import { _decorator, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Bullet')
export class Bullet extends Component {
    start() {

    }

    update(deltaTime: number) {
        let posXBullet = this.node.position.x;
        let posYBullet = this.node.position.y;
        posXBullet += 10;
        this.node.position = new Vec3(posXBullet, posYBullet);
        
        if(posXBullet > 500){
            this.node.active = false;
        }
    }
}


