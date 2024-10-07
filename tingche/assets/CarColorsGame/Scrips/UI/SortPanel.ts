import { _decorator, Component, Node } from 'cc';
import { CarColorsEntryCreat } from '../CarColorsEntryCreat';
import { UINames } from '../CarColorsEntryEnum';
import { UIViewControl } from '../Components/UIViewControl';
import { InfrastManager } from '../../../ScriptFrame/Frame/InfrastManager';
const { ccclass, property } = _decorator;

@ccclass('SortPanel')
export class SortPanel extends UIViewControl {
    useClick(){
        InfrastManager.instance.showVideoAd(()=>{
            CarColorsEntryCreat.instance.roleUiCenter.refreshRoleLine()
            CarColorsEntryCreat.instance.carUiCenter.hideUI(UINames.SortPanel)
            CarColorsEntryCreat.instance.roleUiCenter.isGaming = true
        },()=>{
            CarColorsEntryCreat.instance.messageTpisSystem.showToast("视频播放未完成！")
        })
    }
    closeClick(){
        CarColorsEntryCreat.instance.carUiCenter.hideUI(UINames.SortPanel)
        CarColorsEntryCreat.instance.roleUiCenter.isGaming = true
    }
}


