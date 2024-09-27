import { game, native, sys } from "cc";
import { DataSphere } from "../DataSphere";
import { EDITOR, PREVIEW } from "cc/env";
import { CarColorsEntryCreat } from "../../CarColorsGame/Scrips/CarColorsEntryCreat";

export class InfrastructureDirector {

    private level: number = 1

    private isVibrate: boolean = true
    public callBack: Function = null
    public fcallBack: Function = null
    public static adsVideoId: string = ""
    public static adsInsId: string = ""
    public static adsBannerId: string = ""
    private static adsVideoKey: string = "default"
    private static adsBannerKey: string = "default"

    private static _instance: InfrastructureDirector;
    public static interstitialAd: any = null
    public static rewardedVideoAd : any = null
    public static bannerAd : any = null
    
    // private static bannerAd : ;
    public static get instance () {
        if (this._instance) {
            return this._instance;
        }
        this._instance = new InfrastructureDirector();

        // 安卓端
        if(sys.platform === "ANDROID"){
            native.bridge.onNative = (arg0:string, arg1?: string | null):void=>{
                // 激励相关回调
                if(arg0 == 'video_ad_close'){
                    game.resume()
                    this._instance.callBack && this._instance.callBack();
                }else if (arg0 == 'video_ad_fail'){
                    game.resume()
                    this._instance.fcallBack && this._instance.fcallBack()
                }else if (arg0 == 'video_ad_show_fail'){
                    game.resume()
                    this._instance.fcallBack && this._instance.fcallBack()
                }else if (arg0 == 'video_ad_show'){
                }
                // 插屏相关回调
                else if(arg0 == 'ins_ad_close'){
                    game.resume()
                    this._instance.callBack && this._instance.callBack();
                }else if (arg0 == 'ins_ad_fail'){
                    game.resume()
                    this._instance.fcallBack && this._instance.fcallBack()
                }else if (arg0 == 'ins_ad_show_fail'){
                    game.resume()
                    this._instance.fcallBack && this._instance.fcallBack()
                }else if (arg0 == 'ins_ad_show'){
                }
                // 开屏相关回调
                else if (arg0 == 'open_ad_show'){
                }else if (arg0 == 'open_ad_show_fail'){
                }
                // banner相关回调
                else if (arg0 == 'banner_ad_show'){
                }else if (arg0 == 'banner_ad_show_fail'){
                }
                return;
            };    
        }
        // 微信小游戏
        else if (sys.platform === sys.Platform.WECHAT_GAME && this.adsVideoId !== ""){
            this.interstitialAd = wx.createInterstitialAd({ adUnitId: this.adsInsId })
            this.rewardedVideoAd = wx.createRewardedVideoAd({ adUnitId: this.adsVideoId })
              
            this.rewardedVideoAd.onClose((res)=>{
                if (res && res.isEnded || res === undefined) {
                // 正常播放结束，可以下发游戏奖励
                    game.resume()
                    this._instance.callBack && this._instance.callBack();
                }
                else {
                    game.resume()
                    // 播放中途退出，不下发游戏奖励
                    this._instance.fcallBack && this._instance.fcallBack()
                }
            })
        }
        // 字节小游戏
        else if (sys.platform === sys.Platform.BYTEDANCE_MINI_GAME && this.adsVideoId !== ""){
            this.interstitialAd = tt.createInterstitialAd({ adUnitId: this.adsInsId })
            this.rewardedVideoAd = tt.createRewardedVideoAd({ adUnitId: this.adsVideoId })
            this.rewardedVideoAd.onClose((res)=>{
                if (res && res.isEnded || res === undefined) {
                // 正常播放结束，可以下发游戏奖励
                    game.resume()
                    this._instance.callBack && this._instance.callBack();
                }
                else {
                    // 播放中途退出，不下发游戏奖励
                    game.resume()
                    this._instance.fcallBack && this._instance.fcallBack()
                }
            })
        }
        return this._instance;
    }

    getVibrate(){
        this.isVibrate = DataSphere.instance.getConfigData("vibrate")
        if (this.isVibrate === null){
            this.isVibrate = true
        }
        return this.isVibrate
    }

    setVibrate(isVibrate) {
        this.isVibrate = isVibrate
        DataSphere.instance.setConfigData("vibrate", this.isVibrate)
    }

    startVibrate(time: number = 100) {
        if (!this.isVibrate) return

        // 安卓端
        if(sys.isNative){
            // @ts-ignore
            jsb.Device.vibrate(time / 1000)
            return;
        };

        // 小游戏
        if (sys.platform === sys.Platform.WECHAT_GAME) {
            let type = "medium"
            if (time < 100){
                type = "light"
            }
            wx.vibrateShort({type})
            return
        }

        // 字节
        if (sys.platform === sys.Platform.BYTEDANCE_MINI_GAME){
            tt.vibrateShort()
        }
    }

    public GAInit() {
        // if(sys.platform !== "ANDROID") return

        // let build = "android0.7"
        // let game = "d4cbf6a01f5d61a1acddbba7da124f40"
        // let secret = "f77e3a63de19c11462eeb8e562a19877a3ce4659";

        // (window as any).gameanalytics.GameAnalytics.setEnabledInfoLog(true);
        // (window as any).gameanalytics.GameAnalytics.setEnabledVerboseLog(true);
        // (window as any).gameanalytics.GameAnalytics.configureBuild(build);

        // // (window as any).gameanalytics.GameAnalytics.configureAvailableResourceCurrencies(["toola", "toolb","toolc", "toold","toole", "toolf", "toolg"]);
        // // (window as any).gameanalytics.GameAnalytics.configureAvailableResourceItemTypes(["toola", "toolb","toolc", "toold","toole", "toolf", "toolg"]);
        // (window as any).gameanalytics.GameAnalytics.initialize(game, secret);

    }

    // 关卡开始时上报
    public setLevel(level:number = 1) {
        this.level = level;
    }

    // 关卡开始时上报
    public GaLevelStart(level:number = 1) {
        this.level = level;
        // if(sys.platform !== "ANDROID") return
        // (window as any).gameanalytics.GameAnalytics.addProgressionEvent(
        //     (window as any).gameanalytics.EGAProgressionStatus.Start,
        //     `level_${level}`,
        // );
    }
    // 关卡失败时上报
    public GaLevelFail() {
        // if(sys.platform !== "ANDROID") return
        // (window as any).gameanalytics.GameAnalytics.addProgressionEvent(
        //     (window as any).gameanalytics.EGAProgressionStatus.Fail,
        //     `level_${this.level}`,
        // );
        // if (this.level < 4){
        //     native.bridge.sendToNative('Level_fail', `level${this.level}`);
        // }
    }
    // 关卡通过时上报
    public GaLevelComplete() {
        // if(sys.platform !== "ANDROID") return
        // (window as any).gameanalytics.GameAnalytics.addProgressionEvent(
        //     (window as any).gameanalytics.EGAProgressionStatus.Complete,
        //     `level_${this.level}`,
        // );
        // if (this.level < 4){
        //     native.bridge.sendToNative('Level_pass', `level${this.level}`);
        // }
    }

    public showUpgradeTips(json: string){
        // 安卓端
        if(sys.platform === "ANDROID"){
            native.bridge.sendToNative('showUpgradeTips', json);
            return;
        };
    }
    public showOpenAd(callback?: Function){
        console.log("showOpenAd")
        // 安卓端
        if(sys.platform === "ANDROID"){
            native.bridge.sendToNative('showOpenAd', "defaultAdUrl");
            if(callback) callback()
            return;
        };
    }
    public showBanner(callback?: Function){
        // console.log("showBanner")
        // 安卓端
        if(sys.platform === "ANDROID"){
            native.bridge.sendToNative('showBannerAd', "defaultAdUrl");
            // native.reflection.callStaticMethod("com/cocos/game/AdManage", "showBannerAd", "()V");
            if(callback) callback()
            return;
        };
        
        callback && callback()
        return

        // 微信小游戏
        if (sys.platform === sys.Platform.WECHAT_GAME && InfrastructureDirector.adsBannerId !== ""){
            let { screenWidth, screenHeight } = wx.getSystemInfoSync()
            callback && callback()
            if (InfrastructureDirector.bannerAd !== null){
                InfrastructureDirector.bannerAd.destroy()
            }
            InfrastructureDirector.bannerAd = wx.createBannerAd({
                adUnitId: InfrastructureDirector.adsBannerId,
                style: {
                    left: 0,
                    top: screenHeight - 90,
                    width: screenWidth
                },
                adIntervals: 30,
            })
            InfrastructureDirector.bannerAd.onLoad(()=>{
                InfrastructureDirector.bannerAd.show()
            })
            return
        }
        // 字节小游戏
        if (sys.platform === sys.Platform.BYTEDANCE_MINI_GAME && InfrastructureDirector.adsBannerId !== ""){
            let { screenWidth, screenHeight } = tt.getSystemInfoSync()
            callback && callback()
            if (InfrastructureDirector.bannerAd !== null){
                InfrastructureDirector.bannerAd.destroy()
            }
            InfrastructureDirector.bannerAd = tt.createBannerAd({
                adUnitId: InfrastructureDirector.adsBannerId,
                style: {
                    left: 0,
                    top: screenHeight - 90,
                    width: screenWidth
                },
                adIntervals: 30,
            })
            InfrastructureDirector.bannerAd.onLoad(()=>{
                InfrastructureDirector.bannerAd.show()
            })
            return
        }
    }
    public hideBanner(callback?: Function){
        // console.log("hideBanner")
        // 安卓端
        if(sys.platform === "ANDROID"){
            native.bridge.sendToNative('hideBannerAd', "defaultAdUrl");
            // native.reflection.callStaticMethod("com/cocos/game/AdManage", "hideBannerAd", "()V");
            if(callback) callback()
            return;
        };
        callback && callback()
        return
        // 微信小游戏
        if (sys.platform === sys.Platform.WECHAT_GAME && InfrastructureDirector.adsBannerId !== ""){
            callback && callback()
            if (InfrastructureDirector.bannerAd !== null){
                InfrastructureDirector.bannerAd.hide()
                InfrastructureDirector.bannerAd.destroy()
                InfrastructureDirector.bannerAd = null
            }
            return
        }
        // 字节小游戏
        if (sys.platform === sys.Platform.BYTEDANCE_MINI_GAME && InfrastructureDirector.adsBannerId !== ""){
            callback && callback()
            if (InfrastructureDirector.bannerAd !== null){
                InfrastructureDirector.bannerAd.hide()
                InfrastructureDirector.bannerAd.destroy()
                InfrastructureDirector.bannerAd = null
            }
            return
        }
    }
    public showInsAd(callback?: Function){
        if (this.level < 4) return

        // 安卓端
        if(sys.platform === "ANDROID"){
            game.pause()
            this.callBack = callback
            native.bridge.sendToNative('showInterstitialAd', "defaultAdUrl"); 
            return;
        };

        // 微信小游戏
        if (sys.platform === sys.Platform.WECHAT_GAME && InfrastructureDirector.interstitialAd !== null){
            callback && callback()
            InfrastructureDirector.interstitialAd.show()
            return
        }
        // 字节小游戏
        if (sys.platform === sys.Platform.BYTEDANCE_MINI_GAME && InfrastructureDirector.interstitialAd !== null){
            callback && callback()
            InfrastructureDirector.interstitialAd.show()
            return
        }

        callback && callback()
    }
    showVideoAd(callback?: Function,fcallback?: Function, videoKey:string = "default") {
        console.log("showVideoAd")
        callback&&callback()
        return
        InfrastructureDirector.adsVideoKey = videoKey
        // 安卓端
        if(sys.platform === "ANDROID"){
            game.pause()
            this.callBack = callback
            this.fcallBack = fcallback
            native.bridge.sendToNative('showRewardVideoAd', "defaultAdUrl");
            return;
        };
        
        // 微信小游戏
        if (sys.platform === sys.Platform.WECHAT_GAME && InfrastructureDirector.rewardedVideoAd !== null){
            game.pause()
            // console.log("调用广告")
            this.callBack = callback
            this.fcallBack = fcallback
            InfrastructureDirector.rewardedVideoAd.show()
            .catch(err => {
                fcallback && fcallback()
                game.resume()
                InfrastructureDirector.rewardedVideoAd.load()
            })
            return
        }
        // 字节小游戏
        if (sys.platform === sys.Platform.BYTEDANCE_MINI_GAME && InfrastructureDirector.rewardedVideoAd !== null){
            this.callBack = callback
            this.fcallBack = fcallback
            game.pause()
            InfrastructureDirector.rewardedVideoAd.show()
            .catch(err => {
                fcallback && fcallback()
                game.resume()
                InfrastructureDirector.rewardedVideoAd.load()
            })
            return
        }

        // 测试环境
        callback&&callback()
    }

    shareGame(callback?: Function,fcallback?: Function){
        console.log("shareGame")
        // 安卓端
        if(sys.platform === "ANDROID"){
            // fcallback && fcallback()
            // game.pause()
            callback&&callback()
            CarColorsEntryCreat.instance.toastSysterm.showToast("分享暂不可用，已免费解锁")
            return;
        };
        
        // 微信小游戏
        if (sys.platform === sys.Platform.WECHAT_GAME){
            const nowTime = new Date().getTime()
            wx.shareAppMessage()
            CarColorsEntryCreat.instance.bundleSysterm.scheduleOnce(()=>{
                if (new Date().getTime() - nowTime < 3000){
                    fcallback && fcallback()
                }else {
                    // console.log("分享成功")
                    callback&&callback()
                }
            }, 1)
            return
        }
        // 字节小游戏
        if (sys.platform === sys.Platform.BYTEDANCE_MINI_GAME){
            tt.shareAppMessage({
                success:()=>{
                    callback&&callback()
                },
                fail: ()=>{
                    fcallback && fcallback()
                }
            })
            return
        }

        
        callback&&callback()
    }
}



