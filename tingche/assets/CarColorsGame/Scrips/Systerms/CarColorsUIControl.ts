import { _decorator, Component, find, instantiate, Node, Prefab } from 'cc';
import { UINames } from '../CarColorsEntryEnum';
import { CarColorsEntryCreat } from '../CarColorsEntryCreat';
import { UIViewControl } from '../Components/UIViewControl';
const { ccclass, property } = _decorator;

@ccclass('CarColorsUIControl')
export class CarColorsUIControl extends Component {
    UIScrpits: Map<string, UIViewControl> = new Map()

    // 提前实例化UI预制体
    async loadUIPrefabs(){
        const uiNames = Object.keys(UINames).filter(item => isNaN(Number(item)))
        const prefabList: Array<Prefab> = await Promise.all(CarColorsEntryCreat.instance.bundleSysterm.loadUIPrefab())
        prefabList.forEach((prefab, index)=>{
            const ui = instantiate(prefab)
            const uiScript = ui.getComponent(UIViewControl)
            this.UIScrpits.set(uiNames[index], uiScript)
        })
    }

    
    showUI(name: UINames,opts?:any){
        this.UIScrpits.get(UINames[name]).node.parent = find("UI/Normal")
        this.UIScrpits.get(UINames[name]).show(opts)
    }
    showTopUI(name: UINames,opts?:any){
        this.UIScrpits.get(UINames[name]).node.parent = find("UI/Top")
        this.UIScrpits.get(UINames[name]).show(opts)
    }

    showUIWithParent(name: UINames, parent: Node,opts?:any){
        this.UIScrpits.get(UINames[name]).node.parent = parent
        this.UIScrpits.get(UINames[name]).show(opts)
    }

    hideUI(name: UINames) {
        this.UIScrpits.get(UINames[name])?.hide()
    }
}


