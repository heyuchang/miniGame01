
import { native, sys } from "cc";

export const ConfigKeys = {
    GameSaveData: "CarGameSaveData", // 游戏存档
}


// 全局变量名
export const DataKeys = {
    status: "status", // 存放游戏状态，start,stop,pause
}

export class DataSphere {
    private static _instance: DataSphere;
    static get instance() {
        if (this._instance) {
            return this._instance;
        }

        this._instance = new DataSphere();
        this._instance.init()
        return this._instance;
    }

    private _data: {[key: string]: any} = {}
    private get data() {
        return this._data
    }
    public setData(key: string, value: any){
        this._data[key] = value
    }
    public getData(key: string){
        if(this._data[key] === undefined){
            return null
        }
        return this._data[key]
    }


    private _configData: {[key: string]: any} = {}
    private get configData() {
        return this._configData
    }
    public setConfigData(key: string, value: any){
        this._configData[key] = value
        this.save()
    }
    public getConfigData(key: string){
        if(this._configData[key] === undefined){
            return null
        }
        return this._configData[key]
    }

    path: string = ''

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
            this._configData = JSON.parse(content) || {}
        }else {
            this._configData = {}
        }
        
    }
    
    public save () {
        // 写入文件
        var str = JSON.stringify(this._configData);

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
}