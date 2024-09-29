import { _decorator, Component, find, Node } from 'cc';
import { CarColorsEntryCreat } from '../CarColorsEntryCreat';
import { UINames } from '../CarColorsEntryEnum';
import { UIViewControl } from '../Components/UIViewControl';
import { InfrastructureDirector } from '../../../ScriptFrame/Frame/InfrastructureDirector';
import { GamePanel } from './GamePanel';
const { ccclass, property } = _decorator;

@ccclass('HeroVipPanel')
export class HeroVipPanel extends UIViewControl {
    useClick(){
        InfrastructureDirector.instance.showVideoAd(()=>{
            const gamePage = CarColorsEntryCreat.instance.uiSysterm.UIScrpits.get(UINames[UINames.GamePanel]) as GamePanel
            gamePage.isChooseHelicopterTarget = true
            gamePage.node.getChildByName("chooseTip").active = true
            CarColorsEntryCreat.instance.uiSysterm.hideUI(UINames.HeroVipPanel)
        },()=>{
            CarColorsEntryCreat.instance.toastSysterm.showToast("视频播放未完成！")
        })
    }
    closeClick(){
        CarColorsEntryCreat.instance.uiSysterm.hideUI(UINames.HeroVipPanel)
        CarColorsEntryCreat.instance.roleSysterm.isGaming = true
    }
}
