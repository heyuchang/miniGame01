import { _decorator, AssetManager, assetManager, Component, find, Label, Node, Prefab, ProgressBar } from 'cc';
import { BundleNames, RoleNames, UINames } from '../CarColorsEntryEnum';
const { ccclass, property } = _decorator;

@ccclass('CarColorsBundleInfo')
export class CarColorsBundleInfo extends Component {
    bundles: Map<string, AssetManager.Bundle> = new Map()

    // 加载资源分包
    async loadBundles() {
        let bundleNames = Object.keys(BundleNames)
        let bundleTotal = bundleNames.length
        let bundleProgress = 0
        find("UI/BundleLoading/ProgressBar").getComponent(ProgressBar).progress = bundleProgress / bundleTotal
        find("UI/BundleLoading/Text").getComponent(Label).string = `资源包 ${bundleProgress}/${bundleTotal}`
        const promiseList: Array<Promise<AssetManager.Bundle>> = []
        bundleNames.forEach((name)=>{
            // console.log(name)
            const promise: Promise<AssetManager.Bundle> = new Promise((res, rej)=>{

                assetManager.loadBundle(BundleNames[name], (err, bundle)=>{
                    if (err){
                        console.error(err)
                        rej(err)
                        return
                    }
                    // console.log(bundle)
                    bundleProgress += 1
                    this.bundles.set(BundleNames[name], bundle)
                    find("UI/BundleLoading/ProgressBar").getComponent(ProgressBar).progress = bundleProgress / bundleTotal
                    find("UI/BundleLoading/Text").getComponent(Label).string = `资源包 ${bundleProgress}/${bundleTotal}`
                    res(bundle)
                })
            })
            promiseList.push(promise)
        })

        await Promise.all(promiseList)
    }
    
    // UI资源————————————————————————————————————————————————————————————————————————————————
    loadUIPrefab(): Array<Promise<Prefab>>{
        const promiseList: Array<Promise<Prefab>> = []
        const uiNames = Object.keys(UINames).filter(item => isNaN(Number(item)))
        let total = uiNames.length
        let progress = 0
        uiNames.forEach((key)=>{
            const promise: Promise<Prefab> = new Promise((res, rej)=>{
                this.bundles.get(BundleNames.UI).load(key, Prefab, (err, prefab: Prefab)=>{
                    if (err){
                        console.error(err)
                        rej(err)
                        return
                    }
                    find("UI/BundleLoading/ProgressBar").getComponent(ProgressBar).progress = progress / total
                    find("UI/BundleLoading/Text").getComponent(Label).string = `初始化UI ${progress}/${total}`
                    res(prefab)
                })
            })
            promiseList.push(promise)
        })

        return promiseList
    }
    // 角色资源————————————————————————————————————————————————————————————————————————————————
    loadRolePrefab(): Array<Promise<Prefab>>{
        const promiseList: Array<Promise<Prefab>> = []
        const roleNames = Object.keys(RoleNames).filter(item => isNaN(Number(item)))
        let total = roleNames.length
        let progress = 0
        roleNames.forEach((key)=>{
            const promise: Promise<Prefab> = new Promise((res, rej)=>{
                this.bundles.get(BundleNames.CarColorsCharacter).load(key, Prefab, (err, prefab: Prefab)=>{
                    if (err){
                        console.error(err)
                        rej(err)
                        return
                    }
                    find("UI/BundleLoading/ProgressBar").getComponent(ProgressBar).progress = progress / total
                    find("UI/BundleLoading/Text").getComponent(Label).string = `初始化角色 ${progress}/${total}`
                    res(prefab)
                })
            })
            promiseList.push(promise)
        })

        return promiseList
    }

    // 加载关卡
    loadLevels(lv: number): Promise<Prefab>{
        const promise: Promise<Prefab> = new Promise((res, rej)=>{
            this.bundles.get(BundleNames.CarColorsLevels).load(`level${lv}`, Prefab, (err, prefab: Prefab)=>{
                if (err){
                    // console.error(err)
                    rej(err)
                    return
                }
                res(prefab)
            })
        })
        return promise
    }
}


