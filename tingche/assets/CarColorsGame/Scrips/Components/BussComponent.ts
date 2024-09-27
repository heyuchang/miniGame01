import { _decorator, CCInteger, Component, find, Node, tween } from 'cc';
import { Label3D } from '../../../ScriptFrame/Frame/label-3d';
const { ccclass, property } = _decorator;

@ccclass('BussComponent')
export class BussComponent extends Component {
    @property(Label3D)
    label3D: Label3D = null

    @property(CCInteger)
    get num(){
        return this._num
    }
    set num(value){
        this._num = value
        this.label3D.string = `${value}`
    }
    @property(CCInteger)
    private _num: number = 8

    isAnimateOut:boolean = false

    outCarTween(){
        console.log("outCarTween")
        this.isAnimateOut = true

        const car = this.node.getChildByName("cars").children[0]
        car.setPosition(0,-2,4)
        car.forward = this.node.forward.clone().multiplyScalar(-1)
        car.setParent(find("Scene/Levels").children[0], true)
        this.num -= 1
        const wpos = car.getWorldPosition()
        wpos.add(this.node.forward.clone().multiplyScalar(7))
        wpos.y = 0.1
        tween(car).to(0.5,{
            worldPosition:wpos
        })
        .call(()=>{
            this.isAnimateOut = false
        })
        .start()
    }
}


