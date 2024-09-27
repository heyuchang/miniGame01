import { _decorator, Component, Node } from 'cc';
import { CarColorsBundleInfo } from './Systerms/CarColorsBundleInfo';
import { ToastSysterm } from '../../UIFrame/ToastSysterm/ToastSysterm';
import { CarColorsUIControl } from './Systerms/CarColorsUIControl';
import { CarColorsRoleControl } from './Systerms/CarColorsRoleControl';
import { CarColorsSetControl } from './Systerms/CarColorsSetControl';
const { ccclass, property } = _decorator;

@ccclass('CarColorsEntryCreat')
export class CarColorsEntryCreat extends Component {
    private static _instance: CarColorsEntryCreat;
    public static get instance () {
        if (this._instance) {
            return this._instance;
        }

        this._instance = new CarColorsEntryCreat();
        return this._instance;
    }


    public toastSysterm: ToastSysterm = null
    public bundleSysterm: CarColorsBundleInfo = null
    public uiSysterm: CarColorsUIControl = null
    public roleSysterm: CarColorsRoleControl = null
    public carSysterm: CarColorsSetControl = null
    
}


