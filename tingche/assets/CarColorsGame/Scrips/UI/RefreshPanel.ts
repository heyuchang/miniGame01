import { _decorator, Component, Node } from 'cc';
import { CarColorsEntryCreat } from '../CarColorsEntryCreat';
import { UINames } from '../CarColorsEntryEnum';
import { UIViewControl } from '../Components/UIViewControl';
import { InfrastManager } from '../../../ScriptFrame/Frame/InfrastManager';
const { ccclass, property } = _decorator;

@ccclass('RefreshPanel')
export class RefreshPanel extends UIViewControl {
    useClick(){
        InfrastManager.instance.showVideoAd(()=>{
            CarColorsEntryCreat.instance.bussCenter.refreshCar()
            CarColorsEntryCreat.instance.carUiCenter.hideUI(UINames.RefreshPanel)
            CarColorsEntryCreat.instance.roleUiCenter.isGaming = true
        },()=>{
            CarColorsEntryCreat.instance.messageTpisSystem.showToast("视频播放未完成！")
        })
    }
    closeClick(){
        CarColorsEntryCreat.instance.carUiCenter.hideUI(UINames.RefreshPanel)
        CarColorsEntryCreat.instance.roleUiCenter.isGaming = true
    }
}


