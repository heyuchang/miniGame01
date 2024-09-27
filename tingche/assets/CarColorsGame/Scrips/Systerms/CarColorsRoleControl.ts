import { _decorator, Component, find, geometry, instantiate, Node, NodePool, PhysicsSystem, Prefab, randomRangeInt, tween, Vec3 } from 'cc';
import { heroBussColorsComponent } from '../Components/heroBussColorsComponent';
import { CarColors, CarTypes, RoleNames, UINames } from '../CarColorsEntryEnum';
import { CarColorsEntryCreat } from '../CarColorsEntryCreat';
import { bussColorsComponent } from '../Components/bussColorsComponent';
const { ccclass, property } = _decorator;

@ccclass('CarColorsRoleControl')
export class CarColorsRoleControl extends Component {
    // 对象池
    rolePools: Map<string, {pool:NodePool, prefab: Prefab}> = new Map()  
    activeRole: Map<string, Node> = new Map()

    isGaming: boolean = false

    async loadRolePrefabs(){
        
        const colors = Object.keys(CarColors).filter(item => isNaN(Number(item)))
        const prefabList: Array<Prefab> = await Promise.all(CarColorsEntryCreat.instance.bundleSysterm.loadRolePrefab())
        prefabList.forEach((prefab, index)=>{
            colors.forEach(color=>{
                const pool = new NodePool()
                this.rolePools.set(color, {pool, prefab})
                for(let i = 10; i--;){
                    const role = instantiate(prefab)
                    role.getComponent(heroBussColorsComponent).color = CarColors[color]
                    pool.put(role)
                }
            })
        })
    }

    initLevel(){
        this.clearAll()
        this.addRoleToLine()
        this.scheduleOnce(()=>{
            this.isGaming = true
        },1)
    }
    refreshRoleLine(){
        const points = find("Scene/Parkings").children
        let cars: Array<Node> = []
        for(let i = points.length; i--;){
            if (points[i].name === "inuse" && points[i].children.length === 2){
                cars.push(points[i].children[1])
            }
        }
        let colors: Array<CarColors> = []
        
        for(let i = cars.length; i--;){
            const car = cars[i]
            const carComp = car.getComponent(bussColorsComponent)
            let num = 10
            if (carComp.carType === CarTypes.Minivan){
                num = 6
            }else if (carComp.carType === CarTypes.Sedan){
                num = 4
            }
            num -= carComp.roleNum
            console.log(num)
            for(;num--;){
                // console.log(num)
                colors.push(carComp.carColor)
            }
        }
        console.log(colors.length)
        const roles = find("Scene/Roles").children
        for(let i = 0;i < colors.length;i++){
            if (i >= roles.length){
                break
            }
            const roleCom = roles[i].getComponent(heroBussColorsComponent)
            if (roleCom.color !== colors[i]){
                const colorIndex = CarColorsEntryCreat.instance.carSysterm.carSeats.lastIndexOf(colors[i])

                // 存量未找到，从队列中找
                if (colorIndex === -1){
                    for (let j = roles.length;j--;){
                        if (roles[j].getComponent(heroBussColorsComponent).color === colors[i]){
                            roles[j].getComponent(heroBussColorsComponent).color = roleCom.color
                            break
                        }
                    }
                }else{
                    CarColorsEntryCreat.instance.carSysterm.carSeats[colorIndex] = roleCom.color
                }
                roleCom.color = colors[i]
            }
        }
        

        this.isGaming = true
    }

    addRoleToLine(){

        const rolesNode = find("Scene/Roles")
        for(let i = CarColorsEntryCreat.instance.carSysterm.carSeats.length; i--;){
            if (rolesNode.children.length > 30){
                break
            }
            const color = CarColorsEntryCreat.instance.carSysterm.carSeats.pop()
            const role = this.getRoleFromPool(color)
            role.getComponent(heroBussColorsComponent).startIdleAnimi()
            role.getComponent(heroBussColorsComponent).ishorizonStatus = false
            role.getComponent(heroBussColorsComponent).isTargetArea = false
            role.setScale(1,1,1)
            role.active = false
            this.activeRole.set(role.uuid, role)

            let insetIndex = rolesNode.children.length - randomRangeInt(1, 6)
            if(insetIndex < 0){
                insetIndex = 0
            }
            rolesNode.insertChild(role, insetIndex)
        }
    }

    unlockParkPoint(){
        const points = find("Scene/Parkings").children
        if (points[5].name === "lock"){
            points[5].name = "empty"
            points[5].children[0].children[0].active = true
            points[5].children[0].children[1].active = false

            return
        }
        if (points[6].name === "lock"){
            points[6].name = "empty"
            points[6].children[0].children[0].active = true
            points[6].children[0].children[1].active = false

            return
        }
    }

    // 上客
    moveToCar(){
        const roles = [...find("Scene/Roles").children]
        if (roles.length === 0) return
        const roleCom = roles[0].getComponent(heroBussColorsComponent)
        if (!roleCom.isTargetArea) return
        const points = find("Scene/Parkings").children
        let cars: Array<Node> = []
        let isEmpty = false
        for(let i = points.length; i--;){
            if (points[i].name === "inuse" && points[i].children.length === 2){
                cars.push(points[i].children[1])
                continue
            }

            if (points[i].name === "empty"){
                isEmpty = true
                continue
            }
            if (points[i].name === "inuse" && points[i].children.length === 1){
                isEmpty = true
                continue
            }
        }

        if (cars.length === 0) {
            // console.log("没车了")
            return
        }

        // 
        let selectedCar: Node = null
        for(let i = cars.length; i--;){
            const car = cars[i]
            const carComp = car.getComponent(bussColorsComponent)
            // 颜色相同
            if (carComp.carColor === roleCom.color){
                if (selectedCar === null){
                    selectedCar = car
                    continue
                }
                if (selectedCar.getComponent(bussColorsComponent).roleNum === 0){
                    selectedCar = car
                } 
            }
        }

        // 匹配的车
        if (selectedCar !== null){

            if (selectedCar.getComponent(bussColorsComponent).addRole(roleCom.node)){
                selectedCar.setParent(find("Scene/Levels"), true)
            }
            this.addRoleToLine()
        }else {
            
            // 游戏结束判定
            if (!isEmpty){
                this.isGaming = false
                CarColorsEntryCreat.instance.uiSysterm.showUI(UINames.RevivePage)
            }
            return
        }
    }


    clearOne(roleCom: heroBussColorsComponent){
        this.activeRole.delete(roleCom.node.uuid)
        const poolItem = this.rolePools.get(CarColors[roleCom.color])
        poolItem.pool.put(roleCom.node)
    }

    // 清除所有人
    clearAll(){
        this.activeRole.forEach(role=>{
            role.removeFromParent()
            const poolItem = this.rolePools.get(CarColors[role.getComponent(heroBussColorsComponent).color])
            poolItem.pool.put(role)
        })
        this.activeRole.clear()
    }
    
    // 从对象池获取
    getRoleFromPool(color: CarColors): Node{
        const poolItem = this.rolePools.get(CarColors[color])
        if (poolItem.pool.size() > 0){
            return poolItem.pool.get()
        }
        const role = instantiate(poolItem.prefab)
        role.getComponent(heroBussColorsComponent).color = color
        return role
    }

    // 更新角色位置
    updateRolePos(dt: number){
        find("Scene/Roles").children.forEach((role, index)=>{
            if (role.getComponent(heroBussColorsComponent).stageAnimi === "sit") return

            if (index < 18){
                const roleCom = role.getComponent(heroBussColorsComponent)
                if (!role.active){
                    role.active = true
                    roleCom.startIdleAnimi()
                    roleCom.ishorizonStatus = false
                    role.setRotationFromEuler(-40,0,0)
                    role.setPosition(-10, 0, -6 - index * 2)
                }
                
                let pos = new Vec3()
                role.getPosition(pos)
                let wpos = role.getWorldPosition()
                let forward = new Vec3(0,0,-1)
                if (roleCom.ishorizonStatus){
                    forward = new Vec3(-1,0,0)
                }

                const add = forward.clone().multiplyScalar(dt * -20)
                let distance = add.length()
                if (distance < 1){
                    distance = 1
                }

                let mask = 1<<6
                let ray = new geometry.Ray(wpos.x, wpos.y, wpos.z, add.x, 0, add.z)
                if (PhysicsSystem.instance.raycastClosest(ray, mask, distance, true)) {
                    roleCom.startIdleAnimi()
                    return
                }

                pos.add(add)
                
                // 到达终点判定
                if (roleCom.ishorizonStatus && pos.x > 0){
                    roleCom.startIdleAnimi()
                    roleCom.isTargetArea = true
                    role.setRotationFromEuler(-40,0,0)
                    role.setPosition(0,0,0.2)
                    return
                }else if (!roleCom.ishorizonStatus && pos.z > 0){
                    roleCom.startIdleAnimi()
                    roleCom.ishorizonStatus = true
                    role.setRotationFromEuler(0,90,-30)
                    role.setPosition(-10,0,0)
                    return
                }
                if (role.getComponent(heroBussColorsComponent).stageAnimi === "sit") return
                roleCom.startWalkAnimi()
                role.setPosition(pos)
            }else{
                role.active = false
            }
        })

        this.moveToCar()
    }

    protected update(dt: number): void {
        if (!this.isGaming) return
        this.updateRolePos(dt)
    }
}


