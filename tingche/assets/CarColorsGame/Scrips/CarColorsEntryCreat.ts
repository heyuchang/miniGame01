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


    public messageTpisSystem: ToastSysterm = null
    public bundleCenter: CarColorsBundleInfo = null
    public carUiCenter: CarColorsUIControl = null
    public roleUiCenter: CarColorsRoleControl = null
    public bussCenter: CarColorsSetControl = null
    
}


