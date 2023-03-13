import { _decorator, Component, Node, instantiate, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Pools')
export class Pools extends Component {
    public static instance: Pools;
    private poolObject:Node[] = [];
    private nBullet: number = 10;
    @property({type: Node})
    bulletPf: Node;
    i: number;
    start() {
        for(this.i = 0; this.i < this.nBullet; this.i++){
            const nodeBullet = instantiate(this.bulletPf);
            nodeBullet.parent = director.getScene().getChildByName("Canvas");
            nodeBullet.active = false;
            this.poolObject.push(nodeBullet);
        }
    }

    public getPoolObject(){
        for(this.i = 0; this.i < this.poolObject.length; this.i++){
            //console.log(this.poolObject.length)
            if(!this.poolObject[this.i].active){
                return this.poolObject[this.i];
            }
        }
        return null;
    }

}


