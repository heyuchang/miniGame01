import { _decorator, BoxCollider, Camera, Component, EventTouch, find, geometry, Input, Label, Node, PhysicsSystem, RigidBody, Tween, tween, Vec3 } from 'cc';
import { UIViewControl } from '../Components/UIViewControl';
import { bussColorsComponent } from '../Components/bussColorsComponent';
import { CarColorsEntryCreat } from '../CarColorsEntryCreat';
import { CarColors, UINames } from '../CarColorsEntryEnum';
import { BussGameDataSave, ConfigKeys } from '../../../ScriptFrame/BussGameDataSave';
import { InfrastManager } from '../../../ScriptFrame/Frame/InfrastManager';
const { ccclass, property } = _decorator;

@ccclass('GamePanel')
export class GamePanel extends UIViewControl {
    isAnimateObstacle: boolean = false

    isAnimateHelicopter: boolean = false
    isChooseHelicopterTarget: boolean = false
    
    show(opts?: any): void {
        super.show(opts)
        this.node.on(Input.EventType.TOUCH_START, this.touchStart, this)
        this.isAnimateObstacle = false
        this.node.getChildByName("leveltext").getComponent(Label).string = `第${BussGameDataSave.instance.getConfigData(ConfigKeys.GameSaveCarData).level}关`
    }

    hide(): void {
        super.hide()
        this.node.off(Input.EventType.TOUCH_START, this.touchStart, this)
    }

    refreshClick(){
        if (!CarColorsEntryCreat.instance.roleUiCenter.isGaming) return
        CarColorsEntryCreat.instance.roleUiCenter.isGaming = false
        CarColorsEntryCreat.instance.carUiCenter.showUI(UINames.RefreshPanel)
    }
    sortClick(){
        if (!CarColorsEntryCreat.instance.roleUiCenter.isGaming) return
        CarColorsEntryCreat.instance.roleUiCenter.isGaming = false
        CarColorsEntryCreat.instance.carUiCenter.showUI(UINames.SortPanel)
    }
    vipClick(){
        if (!CarColorsEntryCreat.instance.roleUiCenter.isGaming) return
        if (find("Scene/Parkings").children[7].name !== "lock") {
            CarColorsEntryCreat.instance.messageTpisSystem.showToast("VIP车位占用")
            return
        }
        CarColorsEntryCreat.instance.roleUiCenter.isGaming = false
        CarColorsEntryCreat.instance.carUiCenter.showUI(UINames.HeroVipPanel)
    }

    shareUnlock(){
        InfrastManager.instance.shareGame(()=>{
            const points = find("Scene/Parkings").children
            points[4].name = "empty"
            points[4].children[0].children[0].active = true
            points[4].children[0].children[1].active = false
        })
    }

    videoUnlock1(){
        InfrastManager.instance.showVideoAd(()=>{
            const points = find("Scene/Parkings").children
            points[5].name = "empty"
            points[5].children[0].children[0].active = true
            points[5].children[0].children[1].active = false
        },()=>{
            CarColorsEntryCreat.instance.messageTpisSystem.showToast("视频播放未完成！")
        })
    }
    videoUnlock2(){
        InfrastManager.instance.showVideoAd(()=>{
            const points = find("Scene/Parkings").children
            points[6].name = "empty"
            points[6].children[0].children[0].active = true
            points[6].children[0].children[1].active = false
        },()=>{
            CarColorsEntryCreat.instance.messageTpisSystem.showToast("视频播放未完成！")
        })
    }

    getEmptyParkPoint():Node{
        const points = find("Scene/Parkings").children
        for(let i = 0; i < points.length; i++){
            if (points[i].name === "empty"){
                return points[i]
            }
        }
        return null
    }

    touchStart(event: EventTouch){
        if (this.isAnimateObstacle) return
        if (this.isAnimateHelicopter) return
        let ray = new geometry.Ray();
        find("Main Camera").getComponent(Camera).screenPointToRay(event.getLocationX(), event.getLocationY(), ray);
        // 以下参数可选
        let mask = 1<<2; // 停车位分组
        let maxDistance = 100;
        let queryTrigger = true;

        // 点中停车位
        if (!this.isChooseHelicopterTarget && PhysicsSystem.instance.raycastClosest(ray, mask, maxDistance, queryTrigger)){
            const parkPoint = PhysicsSystem.instance.raycastClosestResult.collider.node.parent.parent
            console.log(parkPoint)
            if (parkPoint.getSiblingIndex() === 4){
                this.shareUnlock()
            }else if (parkPoint.getSiblingIndex() === 5){
                this.videoUnlock1()
            }if (parkPoint.getSiblingIndex() === 6){
                this.videoUnlock2()
            }
            return
        }

        mask = 1<<1; // 汽车分组
        // 点中汽车
        if (PhysicsSystem.instance.raycastClosest(ray, mask, maxDistance, queryTrigger)) {
            const car = PhysicsSystem.instance.raycastClosestResult.collider.node

            // 直升机挪车到VIP位置
            if (this.isChooseHelicopterTarget){
                this.node.getChildByName("chooseTip").active = false
                this.isChooseHelicopterTarget = false
                this.isAnimateHelicopter = true
                this.helicopterTween(car)
                return
            }
            const halfLen = car.getComponent(bussColorsComponent).halfLen
            const pos = car.getWorldPosition()
            const forward = car.forward.clone().multiplyScalar(-1)
            // 检测前方第一个碰撞体
            ray = new geometry.Ray(pos.x, pos.y, pos.z, forward.x, forward.y, forward.z)
            mask = (1<<1) + (1<<4)
            if (PhysicsSystem.instance.raycastClosest(ray, mask, maxDistance, queryTrigger)){
                const collider = PhysicsSystem.instance.raycastClosestResult.collider
                const carMovePos = pos.clone().add(forward.clone().multiplyScalar(PhysicsSystem.instance.raycastClosestResult.distance - halfLen))
                // 碰到车
                if (collider.getGroup() === 1<<1){
                    this.isAnimateObstacle = true
                    tween(car).to(0.1, {
                        worldPosition: carMovePos
                    })
                    // .delay(0.1)
                    .to(0.1, {
                        worldPosition: pos
                    })
                    .call(()=>{
                        this.isAnimateObstacle = false
                    })
                    .start()
                }
                // 碰到路
                else{
                    // 获取停车位
                    const point = this.getEmptyParkPoint()
                    if (point === null) {
                        // console.log("没有车位了")
                        CarColorsEntryCreat.instance.messageTpisSystem.showToast("没有车位了")
                        return
                    }

                    const hitPoint = PhysicsSystem.instance.raycastClosestResult.hitPoint.clone()
                    car.getComponent(BoxCollider).enabled = false
                    car.getComponent(RigidBody).enabled = false
                    let tweenCar: Tween<Node> = tween(car)
                    // 顶部导航
                    if (collider.node.name === "physicRoodTop"){
                        this.hitPointTween(car, point, tweenCar, hitPoint)
                        this.topRoadTween(car, point, tweenCar)
                    }
                    // 左边导航
                    else if (collider.node.name === "physicRoodLeft"){
                        const targetPoint = find("Scene/grounds/physicRoodTop/leftPoint")
                        this.hitPointTween(car, targetPoint, tweenCar, hitPoint)
                        this.leftRoadTween(car, tweenCar)
                        this.topRoadTween(car, point, tweenCar)
                    }
                    // 右边导航
                    else if (collider.node.name === "physicRoodRight"){
                        const targetPoint = find("Scene/grounds/physicRoodTop/rightPoint")
                        this.hitPointTween(car, targetPoint, tweenCar, hitPoint)
                        this.rightRoadTween(car, tweenCar)
                        this.topRoadTween(car, point, tweenCar,)
                    }
                    // 底部导航
                    else if (collider.node.name === "physicRoodBottom"){
                        if (pos.x > 0){
                            const targetPoint = find("Scene/grounds/physicRoodBottom/rightPoint")
                            this.hitPointTween(car, targetPoint, tweenCar, hitPoint)
                            this.bottomRoadTween(car, targetPoint, tweenCar)
                            this.rightRoadTween(car, tweenCar)

                        }else{
                            const targetPoint = find("Scene/grounds/physicRoodBottom/leftPoint")
                            this.hitPointTween(car, targetPoint, tweenCar, hitPoint)
                            this.bottomRoadTween(car, targetPoint, tweenCar)
                            this.leftRoadTween(car, tweenCar)
                        }
                        this.topRoadTween(car, point, tweenCar,)
                    }
                    point.name = "inuse"
                    tweenCar.call(()=>{
                        car.setParent(point, true)
                        // CarColorsEntryCreat.instance.roleUiCenter.moveToCar()
                        car.getChildByName("arrow").active = false
                        car.getChildByPath(`Meshs/${CarColors[car.getComponent(bussColorsComponent).carColor]}/top`).active = false
                        car.setScale(1.15,1.15,1.15)
                    })
                    .start()
                }
            }
        }
    }

    helicopterTween(car: Node){
        const parkPoint = find("Scene/Parkings").children[7]
        parkPoint.name = "inuse"
        parkPoint.children[0].children[0].active = true
        parkPoint.children[0].children[1].active = false
        const helicopter = find("Scene/helicopterPoint/helicopter");
        helicopter.active = true
        const carPos = car.getWorldPosition()
        helicopter.forward = carPos.clone().subtract(helicopter.getWorldPosition()).normalize()
        tween(helicopter).to(1, {
            worldPosition: carPos.clone().add3f(0,3,0)
        })
        .call(()=>{
            car.setParent(helicopter, true)
            car.setRotationFromEuler(0,180,0)
            const forward = helicopter.forward.clone()
            const targetforward = parkPoint.getWorldPosition().subtract(helicopter.getWorldPosition())
            tween(forward).to(0.5, {x:targetforward.x, y:targetforward.y, z:targetforward.z}, {onUpdate:()=>{
                helicopter.forward = forward
            }}).start()
        })
        .delay(0.5)
        .to(1, {
            worldPosition: parkPoint.children[0].getWorldPosition().add3f(0,3,0)
        })
        .call(()=>{
            car.forward = new Vec3(-1.2,0,2)
            car.setParent(parkPoint, true)
            CarColorsEntryCreat.instance.roleUiCenter.isGaming = true
            this.isAnimateHelicopter = false
            car.getChildByName("arrow").active = false
            car.getChildByPath(`Meshs/${CarColors[car.getComponent(bussColorsComponent).carColor]}/top`).active = false
            car.setScale(1.15,1.15,1.15)

            const forward = helicopter.forward.clone()
            const targetforward = helicopter.getPosition().multiplyScalar(-1)
            tween(forward).to(0.2, {x:targetforward.x, y:targetforward.x, z:targetforward.x}, {onUpdate:()=>{
                helicopter.forward = forward
            }}).start()
        })
        .to(1, {
            position:new Vec3(0,0,0)
        })
        .call(()=>{
            helicopter.active = false
        })
        .start()
    }

    // 导航到碰撞点
    hitPointTween(car: Node, targetPoint: Node, tweenCar:Tween<Node>, hitPoint: Vec3 = null){
        const pointForward: Vec3 = hitPoint.clone().subtract(targetPoint.getWorldPosition()).normalize()
        tweenCar.to(0.2, {
            worldPosition: hitPoint
        })
        .call(()=>{
            const carforward = car.forward.clone()
            tween(carforward).to(0.1, {x:pointForward.x, y:pointForward.y,z:pointForward.z}, {onUpdate:()=>{
                car.forward = carforward
            }}).start()
        })
        .delay(0.1)
    }

    // 顶部导航
    topRoadTween(car: Node, targetPoint: Node, tweenCar:Tween<Node>){
        tweenCar.to(0.2, {
            worldPosition: targetPoint.getWorldPosition()
        })
        .call(()=>{
            const carforward = car.forward.clone()
            tween(carforward).to(0.1, {x:-1.2, y:0, z:2}, {onUpdate:()=>{
                car.forward = carforward
            }}).start()
        })
        .delay(0.1)
        .to(0.2, {
            worldPosition: targetPoint.children[0].getWorldPosition()
        })

    }
    // 左边导航
    leftRoadTween(car: Node, tweenCar:Tween<Node>){
        const targetPoint = find("Scene/grounds/physicRoodTop/leftPoint")
        tweenCar.to(0.2, {
            worldPosition: targetPoint.getWorldPosition()
        })
        .call(()=>{
            const carforward = car.forward.clone()
            tween(carforward).to(0.1, {x:-1, y:0, z:0}, {onUpdate:()=>{
                car.forward = carforward
            }}).start()
        })
        .delay(0.1)

    }
    // 右边导航
    rightRoadTween(car: Node, tweenCar:Tween<Node>){
        const targetPoint = find("Scene/grounds/physicRoodTop/rightPoint")
        tweenCar.to(0.2, {
            worldPosition: targetPoint.getWorldPosition()
        })
        .call(()=>{
            const carforward = car.forward.clone()
            tween(carforward).to(0.1, {x:1, y:0, z:0}, {onUpdate:()=>{
                car.forward = carforward
            }}).start()
        })
        .delay(0.1)

    }
    // 底部导航
    bottomRoadTween(car: Node, targetPoint: Node, tweenCar:Tween<Node>){
        tweenCar.to(0.2, {
            worldPosition: targetPoint.getWorldPosition()
        })
        .call(()=>{
            const carforward = car.forward.clone()
            tween(carforward).to(0.1, {x:0, y:0, z:1}, {onUpdate:()=>{
                car.forward = carforward
            }}).start()
        })
        .delay(0.1)

    }
}


