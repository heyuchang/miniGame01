import { _decorator, Component, find, instantiate, Node } from 'cc';
import { UIViewControl } from '../Components/UIViewControl';
import { CarColorsEntryCreat } from '../CarColorsEntryCreat';
import { UINames } from '../CarColorsEntryEnum';
import { DataSphere, ConfigKeys } from '../../../ScriptFrame/DataSphere';
const { ccclass, property } = _decorator;

@ccclass('CarSuccPanel')
export class CarSuccPanel extends UIViewControl {
    show(opts?: any): void {
        super.show(opts)
        const gameSaveData: {level: number} = DataSphere.instance.getConfigData(ConfigKeys.GameSaveData)
        gameSaveData.level += 1
        DataSphere.instance.setConfigData(ConfigKeys.GameSaveData, gameSaveData)
    }
    homeClick(){
        CarColorsEntryCreat.instance.uiSysterm.showUI(UINames.MainPanel)
        CarColorsEntryCreat.instance.uiSysterm.hideUI(UINames.CarSuccPanel)
        CarColorsEntryCreat.instance.uiSysterm.hideUI(UINames.GamePanel)
    }
    nextClick(){
        this.startGame()
    }
    async startGame(){

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
            const Level = instantiate(level)
            find("Scene/Levels").addChild(Level)
            for(let i = 0; i < Level.children.length;i++){
                CarColorsEntryCreat.instance.carSysterm.addCar(Level.children[i])
            }
            CarColorsEntryCreat.instance.roleSysterm.initLevel()
            CarColorsEntryCreat.instance.uiSysterm.showUI(UINames.GamePanel)
            CarColorsEntryCreat.instance.uiSysterm.hideUI(UINames.CarSuccPanel)
        }).catch((err)=>{
            // console.log(err)
            CarColorsEntryCreat.instance.toastSysterm.showToast("关卡正在制作中")
            CarColorsEntryCreat.instance.uiSysterm.showUI(UINames.MainPanel)
            CarColorsEntryCreat.instance.uiSysterm.hideUI(UINames.GamePanel)
            CarColorsEntryCreat.instance.uiSysterm.hideUI(UINames.CarSuccPanel)
        })
    }
}


