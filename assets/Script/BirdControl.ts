import { _decorator, Component, input, Input, Vec3, find, director, Sprite, Label, Button, AudioClip, Animation, SpriteFrame, AnimationClip, PageView, Slider, AudioSource, EventKeyboard, KeyCode, tween } from 'cc';
import { Pools } from './Pools';
const { ccclass, property } = _decorator; 
@ccclass('BirdControl') 
export class BirdControl extends Component { 
    @property({type:Label})
    scorelable:Label = null;
    @property({type:Label})
    bestScore: Label = null;
    @property({type: Sprite})
    gameOver:Sprite = null;
    speed: number = 0; 
    posX: number;
    posY: number;
    score:number = 0;
    scores:number[] = [];
    @property({type: AudioClip})
    audioFly: AudioClip = null;
    @property({type: AudioClip})
    audioScore: AudioClip = null;
    @property({type: AudioClip})
    audioDie: AudioClip = null;
    @property({type: Button})
    PlayGame: Button = null;
    @property({type: SpriteFrame})
    bird1: SpriteFrame = null;
    @property({type: AnimationClip})
    animBird1: AnimationClip = null;
    @property({type: SpriteFrame})
    bird2: SpriteFrame = null;
    @property({type: AnimationClip})
    animBird2: AnimationClip = null;
    @property({type: SpriteFrame})
    bird3: SpriteFrame = null;
    @property({type: AnimationClip})
    animBird3: AnimationClip = null;
    @property({type: Button})
    chooseBird1: Button = null;
    @property({type: Button})
    chooseBird2: Button = null;
    @property({type: Button})
    chooseBird3: Button = null;
    @property({type: Button})
    settings: Button = null;
    @property({type: PageView})
    pageSetting: PageView = null;
    @property({type:Button})
    resumeButton: Button = null;
    @property({type: Slider})
    volumeTotal: Slider = null;
    @property({type: Sprite})
    backgroundGame: Sprite = null;
    @property({type: Pools})
    poolObject: Pools;
    @property({type: Sprite})
    pipe01: Sprite;
    @property({type: Sprite})
    pipe02: Sprite;
    coll: boolean = true;

    start() {
        director.pause();
        //this.gameOver.node.active = false; 
        let storedScores = localStorage.getItem('scores');
        if (storedScores) {
            this.scores = JSON.parse(storedScores);
        }
    }
    onLoad(){ 
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.KEY_DOWN, this.onTouchSpace, this);
        input.on(Input.EventType.KEY_DOWN, this.onKeyDash, this);
    } 
    onDestroy()
    { 
        input.off(Input.EventType.KEY_DOWN, this.onTouchSpace, this);
        input.off(Input.EventType.KEY_DOWN, this.onKeyDash, this);  
    }
    updateScore() {
        this.score += 1;
        console.log("Score: " + this.score);
    }
    update(deltatime: number){

        //Chim bay và góc
        this.speed -= 0.1; 
        let posY = this.node.position.y; 
        let posX = this.node.position.x; 
        posY += this.speed;
        let angle = -(this.speed/2)*30;
        if(angle < 30){
            angle = 30;
        }else {
            angle = -30;
        }
        this.node.angle = angle;
        this.node.position = new Vec3(posX, posY);
        
        let allPipe = this.pipe01.getComponent(Sprite);
        let allPipePosY = allPipe.node.position.y;
        let allPipePosX = allPipe.node.position.x;
        let allPipe2 = this.pipe02.getComponent(Sprite);
        let allPipe2PosY = allPipe2.node.position.y;
        let allPipe2PosX = allPipe2.node.position.x;

        //Khi va chạm và tính điểm + audio
        
        if(this.coll == true){
            if ((((posX >= (allPipePosX - 90)) && (posX <= (allPipePosX + 60)) && posY > (allPipePosY + 60)) || ((posX >= (allPipePosX - 90)) && (posX <= (allPipePosX + 60)) && posY < (allPipePosY - 70))) ||
            ((posX >= (allPipe2PosX - 90)) && (posX <= (allPipe2PosX + 60)) && posY > (allPipe2PosY + 60)) || ((posX >= (allPipe2PosX - 90)) && (posX <= (allPipe2PosX + 60)) && posY < (allPipe2PosY - 70))) 
            {
                this.scores.push(this.score);
                localStorage.setItem('scores', JSON.stringify(this.scores));
                let bestScore = Math.max(...this.scores);
                this.bestScore.string = 'best score: ' +bestScore;
                director.stopAnimation();
                this.gameOver.node.active = true;
                this.audioDie.play();
            }
            else if((posX > (allPipePosX + 61) && posX < (allPipePosX + 66)) || (posX > (allPipe2PosX + 61) && posX < (allPipe2PosX + 66)))
            {
                this.updateScore();
                this.scorelable.string = 'score: '+this.score;
                this.audioScore.play();
            } 
        }
    }
    onKeyDash(event: EventKeyboard) {
        switch(event.keyCode) {
            case KeyCode.KEY_A:
                this.coll = false;
                tween(this.node)
                .to(0.2, { position: new Vec3(this.node.position.x + 150, this.node.position.y, 0)})
                .to(0.4, { position: new Vec3(-269.27, this.node.position.y, 0)})
                .call(() => {   
                    console.log('This is a callback');
                })
                .start()
                this.scheduleOnce(function(){
                    this.coll = true;
                    console.log(this.coll);
                }, 2) 
        }
    }

    onTouchStart(){
        this.speed = 3;
        this.audioFly.play();
    }
    onTouchSpace(event: EventKeyboard){
        switch(event.keyCode){
            case KeyCode.SPACE:
                if(this.poolObject.getPoolObject() != null)
                {
                    //console.log(this.poolObject.getPoolObject())
                    let Object = this.poolObject.getPoolObject();
                    Object.position = this.node.position;
                    Object.active = true;
                }
        }
    }
    PlayButton(){
        director.resume();
        this.PlayGame.node.active = false;
        this.chooseBird1.node.active = false;
        this.chooseBird2.node.active = false;
        this.chooseBird3.node.active = false;

    }
    RePlay(){
        director.loadScene("Main");
        this.gameOver.node.active = false; 
    }
    typeBird(){
        const animationComponent = this.node.getComponent(Animation);
        this.node.getComponent(Sprite).spriteFrame = this.bird1;
        animationComponent.defaultClip=this.animBird1;
        animationComponent.play('FlyingBird');
    }
    typeBird2(){
        const animationComponent = this.node.getComponent(Animation);
        this.node.getComponent(Sprite).spriteFrame = this.bird2;
        animationComponent.defaultClip=this.animBird2;
        animationComponent.play('FlyingBird1');
    }
    typeBird3(){
        const animationComponent = this.node.getComponent(Animation);
        this.node.getComponent(Sprite).spriteFrame = this.bird3;
        animationComponent.defaultClip=this.animBird3;
        animationComponent.play('FlyingBird3');
    }
    pageSettingGame(){
        this.pageSetting.node.active = true;
        director.pause();
    }
    resumeButtonSetting(){
        director.resume();
        this.pageSetting.node.active = false;

    }
    volumeGameSetting(){
        this.backgroundGame.getComponent(AudioSource).volume = this.volumeTotal.progress;
    }
      
}




