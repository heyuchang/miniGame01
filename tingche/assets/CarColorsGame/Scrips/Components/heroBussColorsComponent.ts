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
        this.bussColorUpdate()
    }

    @property({type: Enum(CarColors)})
    private _color: CarColors = CarColors.Blue

    @property({
        type: [Material]
    })
    colorMaterials: Array<Material> = []

    stageAnimi: string = "" // sit, idle, run

    isHorizon: boolean = false

    isIntarget: boolean = false

    bussColorUpdate(){
        this.node.children[0].getComponent(MeshRenderer).setSharedMaterial(this.colorMaterials[this.color], 0)
    }

    playWalk(){
        if (this.stageAnimi === "walk") return
        this.stageAnimi = "walk"
        this.animation.play("Run")
    }
    playSit(){
        this.stageAnimi = "sit"
        const names = ["SitLaughing","SitTalking"]
        this.animation.play(names[randomRangeInt(0,2)])
    }
    playIdle(){
        if (this.stageAnimi === "idle") return
        this.stageAnimi = "idle"
        const names = ["Idle","SadIdle", "HappyIdle", "HappyIdle1"]
        this.animation.play(names[randomRangeInt(0,4)])
    }
    sitfinish(){
        if (this.node.activeInHierarchy && this.stageAnimi === "sit"){
            this.playSit()
        }
    }
    idlefinish(){

        if (this.node.activeInHierarchy && this.stageAnimi === "idle"){
            this.playIdle()
        }
    }
}


