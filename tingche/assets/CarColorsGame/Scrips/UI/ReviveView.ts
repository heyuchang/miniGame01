import { _decorator, Component, Node } from 'cc';
import { UIViewControl } from '../Components/UIViewControl';
import { CarColorsEntryCreat } from '../CarColorsEntryCreat';
import { UINames } from '../CarColorsEntryEnum';
import { InfrastructureDirector } from '../../../ScriptFrame/Frame/InfrastructureDirector';
const { ccclass, property } = _decorator;

@ccclass('RevivePage')
export class RevivePage extends UIViewControl {
    reviveClick(){
        InfrastructureDirector.instance.showVideoAd(()=>{
            CarColorsEntryCreat.instance.roleSysterm.refreshRoleLine()
            CarColorsEntryCreat.instance.uiSysterm.hideUI(UINames.RevivePage)
        },()=>{
            CarColorsEntryCreat.instance.toastSysterm.showToast("视频播放未完成！")
        })
    }
    closeClick(){
        CarColorsEntryCreat.instance.uiSysterm.showUI(UINames.FailPanel)
        CarColorsEntryCreat.instance.uiSysterm.hideUI(UINames.RevivePage)
    }
}


