
import { native, sys } from "cc";

// 全局变量名
export const DataKeys = {
    stageAnimi: "stageAnimi", // 存放游戏状态，start,stop,pause
}


export const ConfigKeys = {
    GameSaveCarData: "CarGameSaveData", // 游戏存档
}


export class BussGameDataSave {
    private static _instance: BussGameDataSave;
    static get instance() {
        if (this._instance) {
            return this._instance;
        }

        this._instance = new BussGameDataSave();
        this._instance.init()
        return this._instance;
    }

    private _dataInfo: {[key: string]: any} = {}
    private get data() {
        return this._dataInfo
    }
    public setData(key: string, value: any){
        this._dataInfo[key] = value
    }
    public getData(key: string){
        if(this._dataInfo[key] === undefined){
            return null
        }
        return this._dataInfo[key]
    }


    private _configInfoData: {[key: string]: any} = {}
    private get configData() {
        return this._configInfoData
    }
    public setConfigData(key: string, value: any){
        this._configInfoData[key] = value
        this.save()
    }
    public getConfigData(key: string){
        if(this._configInfoData[key] === undefined){
            return null
        }
        return this._configInfoData[key]
    }

    path: string = ''

    getConfigPath () {

        var platform: any = sys.platform;

        var path: any = "";

        if (platform === sys.OS.WINDOWS) {
            path = "src/conf";
        } else if (platform === sys.OS.LINUX) {
            path = "./conf";
        } else {
            if (sys.isNative) {
                path = native.fileUtils.getWritablePath();
                path = path + "conf";
            } else {
                path = "src/conf";
            }
        }

        return path;
    }

    init(){
        this.path = this.getConfigPath()
        let content;
        if (sys.isNative) {
            var valueObject = native.fileUtils.getValueMapFromFile(this.path);
            content = valueObject["CarConfigData"];
        } else {
            content = sys.localStorage.getItem("CarConfigData");
        }
        if (content){
            this._configInfoData = JSON.parse(content) || {}
        }else {
            this._configInfoData = {}
        }
        
    }
    
    public save () {
        // 写入文件
        var str = JSON.stringify(this._configInfoData);

        // // 加密代码
        // if (cc.game.config["encript"]) {
        //     str = new Xxtea("upgradeHeroAbility").xxteaEncrypt(str);
        // }

        // let zipStr = '@' + Util.encrypt(str);
        let zipStr = str;

        
        if (!sys.isNative) {
            var ls = sys.localStorage;
            ls.setItem("CarConfigData", zipStr);
            return;
        }

        var valueObj: any = {};
        valueObj["CarConfigData"] = zipStr;
        //@ts-ignore
        native.fileUtils.writeToFile(valueObj, this.path);

    }
    
}