import { _decorator, Component, Node } from 'cc';
import { CarColorsEntryCreat } from '../CarColorsEntryCreat';
import { UINames } from '../CarColorsEntryEnum';
import { UIViewControl } from '../Components/UIViewControl';
import { InfrastructureDirector } from '../../../ScriptFrame/Frame/InfrastructureDirector';
const { ccclass, property } = _decorator;

@ccclass('RefreshPage')
export class RefreshPage extends UIViewControl {
    useClick(){
        InfrastructureDirector.instance.showVideoAd(()=>{
            CarColorsEntryCreat.instance.carSysterm.refreshCar()
            CarColorsEntryCreat.instance.uiSysterm.hideUI(UINames.RefreshPage)
            CarColorsEntryCreat.instance.roleSysterm.isGaming = true
        },()=>{
            CarColorsEntryCreat.instance.toastSysterm.showToast("视频播放未完成！")
        })
    }
    closeClick(){
        CarColorsEntryCreat.instance.uiSysterm.hideUI(UINames.RefreshPage)
        CarColorsEntryCreat.instance.roleSysterm.isGaming = true
    }
}


