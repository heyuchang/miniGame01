import { _decorator, Component, find, instantiate, Node } from 'cc';
import { UIViewControl } from '../Components/UIViewControl';
import { CarColorsEntryCreat } from '../CarColorsEntryCreat';
import { UINames } from '../CarColorsEntryEnum';
import { DataSphere, ConfigKeys } from '../../../ScriptFrame/DataSphere';
const { ccclass, property } = _decorator;

@ccclass('MainPanel')
export class MainPanel extends UIViewControl {
    @property(Node)
    startBtn: Node = null
    show(opts?: any): void {
        super.show(opts)
        this.startBtn.active = true
    }
    async startGame(){
        this.startBtn.active = false

        find("Scene/Parkings").children.forEach((child, index)=>{
            if (index < 4){
                child.name = "empty"
            }else{
                child.name = "lock"
                child.children[0].children[0].active = false
                child.children[0].children[1].active = true
            }
            child.children[1]?.destroy()
            child.children[1]?.removeFromParent()
        })
        find("Scene/Levels").destroyAllChildren()
        find("Scene/Levels").removeAllChildren()
        CarColorsEntryCreat.instance.roleSysterm.clearAll()
        CarColorsEntryCreat.instance.carSysterm.clearAll()
        CarColorsEntryCreat.instance.bundleSysterm.loadLevels(DataSphere.instance.getConfigData(ConfigKeys.GameSaveData).level).then((level)=>{
            console.log("instantiate(level)")
            const Level = instantiate(level)
            find("Scene/Levels").addChild(Level)
            for(let i = 0; i < Level.children.length;i++){
                CarColorsEntryCreat.instance.carSysterm.addCar(Level.children[i])
            }
            CarColorsEntryCreat.instance.roleSysterm.initLevel()
            CarColorsEntryCreat.instance.uiSysterm.showUI(UINames.GamePanel)
            CarColorsEntryCreat.instance.uiSysterm.hideUI(UINames.MainPanel)
        }).catch((err)=>{
            console.log(err)
            CarColorsEntryCreat.instance.toastSysterm.showToast("关卡正在制作中")
            this.startBtn.active = true
            CarColorsEntryCreat.instance.uiSysterm.hideUI(UINames.GamePanel)
        })
    }
}

