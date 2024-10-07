import { _decorator, Component, Node } from 'cc';
import { UIViewControl } from '../Components/UIViewControl';
import { CarColorsEntryCreat } from '../CarColorsEntryCreat';
import { UINames } from '../CarColorsEntryEnum';
import { InfrastManager } from '../../../ScriptFrame/Frame/InfrastManager';
const { ccclass, property } = _decorator;

@ccclass('RevivePanel')
export class RevivePanel extends UIViewControl {
    reviveClick(){
        InfrastManager.instance.showVideoAd(()=>{
            CarColorsEntryCreat.instance.roleUiCenter.refreshRoleLine()
            CarColorsEntryCreat.instance.carUiCenter.hideUI(UINames.RevivePanel)
        },()=>{
            CarColorsEntryCreat.instance.messageTpisSystem.showToast("视频播放未完成！")
        })
    }
    closeClick(){
        CarColorsEntryCreat.instance.carUiCenter.showUI(UINames.FailPanel)
        CarColorsEntryCreat.instance.carUiCenter.hideUI(UINames.RevivePanel)
    }
}


