import { _decorator, Component, find, geometry, Node, PhysicsSystem } from 'cc';
import { CarColors, CarTypes } from '../CarColorsEntryEnum';
import { bussColorsComponent } from '../Components/bussColorsComponent';
import { BussComponent } from '../Components/BussComponent';
import { CarColorsEntryCreat } from '../CarColorsEntryCreat';
const { ccclass, property } = _decorator;

@ccclass('CarColorsSetControl')
export class CarColorsSetControl extends Component {
    activeCar: Map<string, Node> = new Map()

    carSeats: Array<CarColors> = []

    carBoxMap:Array<BussComponent> = []

    addCar(node: Node){
        const carBoxCom = node.getComponent(BussComponent)
        if (carBoxCom){
            this.carBoxMap.push(carBoxCom)
            node.getChildByName("cars").children.forEach((car)=>{
                this.addCar(car)
            })
            return
        }
        this.activeCar.set(node.uuid,node)
        const color = node.getComponent(bussColorsComponent).carColor
        const carType = node.getComponent(bussColorsComponent).carType
        let len = 10
        if (carType === CarTypes.Minivan){
            len = 6
        }
        else if (carType === CarTypes.Sedan){
            len = 4
        }

        for(;len--;){
            this.carSeats.push(color)
        }
    }

    removeCar(node: Node){

        this.activeCar.delete(node.uuid)
    }

    clearAll(){
        this.activeCar.clear()
        this.carBoxMap.length = 0
        this.carBoxMap = []

        this.carSeats.length = 0
        this.carSeats = []
    }

    refreshCar(){
        const cars = find("Scene/Levels").children[0].children

        const miniCars: {cars: Array<Node>, colors: Array<CarColors>} = {
            cars:[],
            colors:[]
        }
        const middleCars: {cars: Array<Node>, colors: Array<CarColors>} = {
            cars:[],
            colors:[]
        }
        const bigCars: {cars: Array<Node>, colors: Array<CarColors>} = {
            cars:[],
            colors:[]
        }
        cars.forEach(car=>{
            const carCom = car.getComponent(bussColorsComponent)
            if (!carCom) return
            if (carCom.carType === CarTypes.Sedan){
                miniCars.cars.push(car)
                miniCars.colors.push(carCom.carColor)
                return
            }
            if (carCom.carType === CarTypes.Minivan){
                middleCars.cars.push(car)
                middleCars.colors.push(carCom.carColor)
                return
            }
            if (carCom.carType === CarTypes.Bus){
                bigCars.cars.push(car)
                bigCars.colors.push(carCom.carColor)
                return
            }
        })

        miniCars.colors.sort(() => Math.random() - 0.5);
        middleCars.colors.sort(() => Math.random() - 0.5);
        bigCars.colors.sort(() => Math.random() - 0.5);
        miniCars.cars.forEach((car, index)=>{
            car.getComponent(bussColorsComponent).carColor = miniCars.colors[index]
        })
        middleCars.cars.forEach((car, index)=>{
            car.getComponent(bussColorsComponent).carColor = middleCars.colors[index]
        })
        bigCars.cars.forEach((car, index)=>{
            car.getComponent(bussColorsComponent).carColor = bigCars.colors[index]
        })
    }

    checkCarBox(){
        if (this.carBoxMap.length === 0) return

        let mask = 1<<1; //车分组
        let maxDistance = 100;
        let queryTrigger = true;
        for(let i = this.carBoxMap.length;i--;){
            const carBoxCom = this.carBoxMap[i]
            if (carBoxCom.isAnimateOut) continue
            if (carBoxCom.num <= 0){
                this.carBoxMap.splice(i,1)
                continue
            }
            const pos = carBoxCom.node.getWorldPosition()
            const forward = carBoxCom.node.forward.clone()
            // 检测前方第一个碰撞体
            const ray = new geometry.Ray(pos.x, pos.y, pos.z, forward.x, forward.y, forward.z)
            // 前方没有障碍物
            if (!PhysicsSystem.instance.raycastClosest(ray, mask, maxDistance, queryTrigger)){
                carBoxCom.outTweenCar()
            }
        }
    }

    protected lateUpdate(dt: number): void {
        if (!CarColorsEntryCreat.instance.roleSysterm.isGaming) return
        this.checkCarBox()
    }
}


