import { _decorator, Component, Enum, find, Node, tween, Vec3 } from 'cc';
import { CarColors, CarTypes, UINames } from '../CarColorsEntryEnum';
import { heroBussColorsComponent } from './heroBussColorsComponent';
import { CarColorsEntryCreat } from '../CarColorsEntryCreat';
const { ccclass, property,executeInEditMode } = _decorator;
@ccclass('bussColorsComponent')
@executeInEditMode
export class bussColorsComponent extends Component {
    @property({type: Enum(CarTypes)})
    carType: CarTypes = CarTypes.Bus
    @property({type: Enum(CarColors)})
    get carColor(){
        return this._carColor
    }
    set carColor(value){
        this._carColor = value
        this.bussColorUpdate()
    }
    @property({type: Enum(CarColors)})
    private _carColor: CarColors = CarColors.Purple

    halfLen: number = 2

    roleNum: number = 0
    isFull: boolean = false

    tweenCount = 0

    exitCar(){
        this.node.getChildByName("Seets").children.forEach(seat=>{
            if (seat.children.length === 0) return
            const roleCom = seat.children[0].getComponent(heroBussColorsComponent)
            CarColorsEntryCreat.instance.roleSysterm.clearOne(roleCom)
        })
        CarColorsEntryCreat.instance.carSysterm.removeCar(this.node)
        this.node.removeFromParent()
        this.node.destroy()

        // console.log("exitCar:", find("Scene/Levels").children.length, find("Scene/Levels").children[0].children.length, find("Scene/Roles").children.length)
        // 判定胜利
        if (CarColorsEntryCreat.instance.carSysterm.activeCar.size === 0){
            if (find("Scene/Roles").children.length === 0){
                CarColorsEntryCreat.instance.uiSysterm.showUI(UINames.CarSuccPanel)
                CarColorsEntryCreat.instance.uiSysterm.hideUI(UINames.GamePanel)
            }
        }
    }

    // 车离开
    carExitUpdate(target: Node){
        tween(this.node).to(0.2, {
            worldPosition: target.getWorldPosition()
        })
        .call(()=>{
            const carforward = this.node.forward.clone()
            tween(carforward).to(0.1, {x:-1, y:0, z:0}, {onUpdate:()=>{
                this.node.forward = carforward
            }}).start()
        })
        .delay(0.1)
        .to(0.2, {
            worldPosition: find("Scene/grounds/physicRoodTop/rightPoint").getWorldPosition()
        })
        .call(()=>{
            this.exitCar()
        })
        .start()
    }

    onLoad(){
        this.bussColorUpdate()
        if (this.carType === CarTypes.Minivan){
            this.halfLen = 1.6
        }else if (this.carType === CarTypes.Sedan){
            this.halfLen = 1.4
        }
        
        this.roleNum = 0
        this.isFull = false
    }

    grantRole(role: Node): boolean{
        const carPoint = this.node.parent
        role.setParent(this.node.getChildByName("Seets").children[this.roleNum],true)
        role.getComponent(heroBussColorsComponent).startWalkAnimi()
        tween(role).to(0.2,{
            position: new Vec3(0,0,-0.1)
        }).call(()=>{
            this.tweenCount -= 1
            role.setScale(0.9,0.9,0.9)
            role.setRotationFromEuler(0,0,0)
            role.getComponent(heroBussColorsComponent).startSitAnimi()
            if (this.tweenCount <= 0 && this.isFull){
                if(carPoint.getSiblingIndex()===7){
                    carPoint.name = "lock"
                    carPoint.children[0].children[0].active = false
                    carPoint.children[0].children[1].active = true
                }else {
                    carPoint.name = "empty"
                }
                this.carExitUpdate(carPoint)
            }
        })
        .start()

        this.tweenCount += 1
        this.roleNum += 1
        if (this.carType === CarTypes.Minivan){
            this.isFull = this.roleNum > 5
        }else if (this.carType === CarTypes.Sedan){
            this.isFull = this.roleNum > 3
        }else if (this.carType === CarTypes.Bus){
            this.isFull = this.roleNum > 9
        }

        return this.isFull
    }

    bussColorUpdate(){
        this.node.getChildByName("Meshs").children.forEach(child=>{
            if (child.name === CarColors[this._carColor]){
                child.active = true
                child.children[0].active = true
            }else{
                child.active = false
                child.children[0].active = true
            }
        })

        this.node.getChildByName("arrow").active = true

        tween(this.node)
        .to(0.2, {scale: new Vec3(1.4,1.4,1.4)})
        .to(0.2, {scale: new Vec3(0.95,0.95,0.95)})
        .start()
    }
}


