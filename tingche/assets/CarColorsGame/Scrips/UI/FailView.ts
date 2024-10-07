import { _decorator, Component, find, instantiate, Node } from 'cc';
import { UIViewControl } from '../Components/UIViewControl';
import { CarColorsEntryCreat } from '../CarColorsEntryCreat';
import { UINames } from '../CarColorsEntryEnum';
import { ConfigKeys, BussGameDataSave } from '../../../ScriptFrame/BussGameDataSave';
const { ccclass, property } = _decorator;

@ccclass('FailPanel')
export class FailPanel extends UIViewControl {
    homeClick(){
        CarColorsEntryCreat.instance.carUiCenter.showUI(UINames.MainPanel)
        CarColorsEntryCreat.instance.carUiCenter.hideUI(UINames.GamePanel)
        CarColorsEntryCreat.instance.carUiCenter.hideUI(UINames.FailPanel)
    }
    replayClick(){
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
        CarColorsEntryCreat.instance.roleUiCenter.clearAll()
        CarColorsEntryCreat.instance.bussCenter.clearAll()
        CarColorsEntryCreat.instance.bundleCenter.loadLevels(BussGameDataSave.instance.getConfigData(ConfigKeys.GameSaveCarData).level).then((level)=>{
            const Level = instantiate(level)
            find("Scene/Levels").addChild(Level)
            for(let i = 0; i < Level.children.length;i++){
                CarColorsEntryCreat.instance.bussCenter.addCar(Level.children[i])
            }
            CarColorsEntryCreat.instance.roleUiCenter.initLevel()
            CarColorsEntryCreat.instance.carUiCenter.showUI(UINames.GamePanel)
            CarColorsEntryCreat.instance.carUiCenter.hideUI(UINames.MainPanel)
            CarColorsEntryCreat.instance.carUiCenter.hideUI(UINames.FailPanel)
        }).catch((err)=>{
            // console.log(err)
            CarColorsEntryCreat.instance.messageTpisSystem.showToast("关卡正在制作中")
            CarColorsEntryCreat.instance.carUiCenter.showUI(UINames.MainPanel)
            CarColorsEntryCreat.instance.carUiCenter.hideUI(UINames.GamePanel)
        })
    }
}


