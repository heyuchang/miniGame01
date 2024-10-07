import { _decorator, Component, Node, sys,find, CCString } from 'cc';
import { CarColorsEntryCreat } from './CarColorsEntryCreat';
import { ToastSysterm } from '../../UIFrame/ToastSysterm/ToastSysterm';
import { CarColorsBundleInfo } from './Systerms/CarColorsBundleInfo';
import { CarColorsUIControl } from './Systerms/CarColorsUIControl';
import { UINames } from './CarColorsEntryEnum';
import { CarColorsRoleControl } from './Systerms/CarColorsRoleControl';
import { BussGameDataSave, ConfigKeys } from '../../ScriptFrame/BussGameDataSave';
import { CarColorsSetControl } from './Systerms/CarColorsSetControl';
import { InfrastManager } from '../../ScriptFrame/Frame/InfrastManager';
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
        InfrastManager.adsInsId = this.insADid
        InfrastManager.adsVideoId = this.rewardADid
        InfrastManager.adsBannerId = this.bannerADid
        if (sys.platform === sys.Platform.WECHAT_GAME){
            wx.showShareMenu({
                withShareTicket: true,
                menus: ['shareAppMessage', 'shareTimeline']
              })
        }
        this.initData()
        // 挂载toast弹窗
        CarColorsEntryCreat.instance.messageTpisSystem = find("UI/ToastSysterm").getComponent(ToastSysterm)

        // 挂载资源包管理系统
        CarColorsEntryCreat.instance.bundleCenter = this.node.addComponent(CarColorsBundleInfo)
        await CarColorsEntryCreat.instance.bundleCenter.loadBundles()

        // 人物管理系统
        CarColorsEntryCreat.instance.roleUiCenter = this.node.addComponent(CarColorsRoleControl)
        await CarColorsEntryCreat.instance.roleUiCenter.loadRolePrefabs()

        // 汽车管理系统
        CarColorsEntryCreat.instance.bussCenter = this.node.addComponent(CarColorsSetControl)
        
        // 挂载UI系统
        CarColorsEntryCreat.instance.carUiCenter = this.node.addComponent(CarColorsUIControl)
        await CarColorsEntryCreat.instance.carUiCenter.loadUIPrefabs()
        
        CarColorsEntryCreat.instance.carUiCenter.showUI(UINames.MainPanel)
        find("UI/BundleLoading").active = false
    }

    initData(){
        let  gameSaveData: {level: number} = BussGameDataSave.instance.getConfigData(ConfigKeys.GameSaveCarData)
        if (gameSaveData === null){
            gameSaveData = {
                level: 1
            }
        }
        BussGameDataSave.instance.setConfigData(ConfigKeys.GameSaveCarData, gameSaveData)
    }
}


