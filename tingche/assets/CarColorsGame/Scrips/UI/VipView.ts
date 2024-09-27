import { _decorator, Component, find, Node } from 'cc';
import { CarColorsEntryCreat } from '../CarColorsEntryCreat';
import { UINames } from '../CarColorsEntryEnum';
import { UIViewControl } from '../Components/UIViewControl';
import { InfrastructureDirector } from '../../../ScriptFrame/Frame/InfrastructureDirector';
import { GamePage } from './GamePage';
const { ccclass, property } = _decorator;

@ccclass('VipPage')
export class VipPage extends UIViewControl {
    useClick(){
        InfrastructureDirector.instance.showVideoAd(()=>{
            const gamePage = CarColorsEntryCreat.instance.uiSysterm.UIScrpits.get(UINames[UINames.GamePage]) as GamePage
            gamePage.isChooseHelicopterTarget = true
            gamePage.node.getChildByName("chooseTip").active = true
            CarColorsEntryCreat.instance.uiSysterm.hideUI(UINames.VipPage)
        },()=>{
            CarColorsEntryCreat.instance.toastSysterm.showToast("视频播放未完成！")
        })
    }
    closeClick(){
        CarColorsEntryCreat.instance.uiSysterm.hideUI(UINames.VipPage)
        CarColorsEntryCreat.instance.roleSysterm.isGaming = true
    }
}
