import { _decorator, Component, Node, sys,find, CCString } from 'cc';
import { CarColorsEntryCreat } from './CarColorsEntryCreat';
import { ToastSysterm } from '../../UIFrame/ToastSysterm/ToastSysterm';
import { CarColorsBundleInfo } from './Systerms/CarColorsBundleInfo';
import { CarColorsUIControl } from './Systerms/CarColorsUIControl';
import { UINames } from './CarColorsEntryEnum';
import { CarColorsRoleControl } from './Systerms/CarColorsRoleControl';
import { DataSphere, ConfigKeys } from '../../ScriptFrame/DataSphere';
import { CarColorsSetControl } from './Systerms/CarColorsSetControl';
import { InfrastructureDirector } from '../../ScriptFrame/Frame/InfrastructureDirector';
const { ccclass, property } = _decorator;

@ccclass('CarColorsEntryControl')
export class CarColorsEntryControl extends Component {
    @property(CCString)
    insADid: string = ""
    @property(CCString)
    rewardADid: string = ""
    @property(CCString)
    bannerADid: string = ""
    @property(CCString)
    bookId: string = ""

    async start() {
        InfrastructureDirector.adsInsId = this.insADid
        InfrastructureDirector.adsVideoId = this.rewardADid
        InfrastructureDirector.adsBannerId = this.bannerADid
        if (sys.platform === sys.Platform.WECHAT_GAME){
            wx.showShareMenu({
                withShareTicket: true,
                menus: ['shareAppMessage', 'shareTimeline']
              })
        }
        this.initData()
        // 挂载toast弹窗
        CarColorsEntryCreat.instance.toastSysterm = find("UI/ToastSysterm").getComponent(ToastSysterm)

        // 挂载资源包管理系统
        CarColorsEntryCreat.instance.bundleSysterm = this.node.addComponent(CarColorsBundleInfo)
        await CarColorsEntryCreat.instance.bundleSysterm.loadBundles()

        // 人物管理系统
        CarColorsEntryCreat.instance.roleSysterm = this.node.addComponent(CarColorsRoleControl)
        await CarColorsEntryCreat.instance.roleSysterm.loadRolePrefabs()

        // 汽车管理系统
        CarColorsEntryCreat.instance.carSysterm = this.node.addComponent(CarColorsSetControl)
        
        // 挂载UI系统
        CarColorsEntryCreat.instance.uiSysterm = this.node.addComponent(CarColorsUIControl)
        await CarColorsEntryCreat.instance.uiSysterm.loadUIPrefabs()
        
        CarColorsEntryCreat.instance.uiSysterm.showUI(UINames.HomePage)
        find("UI/BundleLoading").active = false
    }

    initData(){
        let  gameSaveData: {level: number} = DataSphere.instance.getConfigData(ConfigKeys.GameSaveData)
        if (gameSaveData === null){
            gameSaveData = {
                level: 1
            }
        }
        DataSphere.instance.setConfigData(ConfigKeys.GameSaveData, gameSaveData)
    }
}


