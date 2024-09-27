import { _decorator, Component, Enum, Material, MeshRenderer, Node,Animation, randomRangeInt } from 'cc';
import { CarColors } from '../CarColorsEntryEnum';
const { ccclass, property } = _decorator;


@ccclass('heroBussColorsComponent')
export class heroBussColorsComponent extends Component {
    @property(Animation)
    animation: Animation = null
    @property({type: Enum(CarColors)})
    get color(){
        return this._color
    }
    set color(value){
        this._color = value
        this.changeColor()
    }

    @property({type: Enum(CarColors)})
    private _color: CarColors = CarColors.Blue

    @property({
        type: [Material]
    })
    colorMaterials: Array<Material> = []

    status: string = "" // sit, idle, run

    isHorizon: boolean = false

    isIntarget: boolean = false

    changeColor(){
        this.node.children[0].getComponent(MeshRenderer).setSharedMaterial(this.colorMaterials[this.color], 0)
    }

    playWalk(){
        if (this.status === "walk") return
        this.status = "walk"
        this.animation.play("Run")
    }
    playSit(){
        this.status = "sit"
        const names = ["SitLaughing","SitTalking"]
        this.animation.play(names[randomRangeInt(0,2)])
    }
    playIdle(){
        if (this.status === "idle") return
        this.status = "idle"
        const names = ["Idle","SadIdle", "HappyIdle", "HappyIdle1"]
        this.animation.play(names[randomRangeInt(0,4)])
    }
    sitfinish(){
        if (this.node.activeInHierarchy && this.status === "sit"){
            this.playSit()
        }
    }
    idlefinish(){

        if (this.node.activeInHierarchy && this.status === "idle"){
            this.playIdle()
        }
    }
}


