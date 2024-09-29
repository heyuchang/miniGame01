import { _decorator, AudioClip, AudioSource, assert } from 'cc';
import { DataSphere } from '../DataSphere';
import { AudioClipNames } from '../GlobalTypes';
const { ccclass, property } = _decorator;

@ccclass('AudioCreator')
export class AudioCreator {
    private audioSource: AudioSource = null;

    private soundOn: boolean = true

    clips: {[props:string]:AudioClip} = {}

    private static _instance: AudioCreator;
    public static get instance () {
        if (this._instance) {
            return this._instance;
        }

        this._instance = new AudioCreator();
        return this._instance;
    }

    init(audioSource: AudioSource){
        this.audioSource = audioSource
        this.getSoundConfig()
        if (this.soundOn){
            this.play()
        }else {
            this.pause()
        }
    }

    getSoundConfig(){
        this.soundOn = DataSphere.instance.getConfigData("audioconfig")
        if (this.soundOn === null){
            this.soundOn = true
        }
        return this.soundOn
    }

    setSoundConfig(soundOn: boolean) {
        this.soundOn = soundOn
        if (this.soundOn){
            this.play()
        }else {
            this.pause()
        }
        DataSphere.instance.setConfigData("audioconfig", this.soundOn)
    }

    play () {
        if (!this.soundOn) return
        // 播放音乐
        this.audioSource.play();
    }

    pause () {
        // 暂停音乐
        this.audioSource.pause();
    }

    async playBgm (clipName: AudioClipNames) {
        if (!this.soundOn) return
        this.audioSource.stop()
        this.audioSource.clip = this.clips[AudioClipNames[clipName]]
        this.audioSource.play();
    }

    playOneShot (clipName: AudioClipNames, volume: number = 1) {
        if (!this.soundOn) return
        this.audioSource.playOneShot(this.clips[AudioClipNames[clipName]], volume);
    }
}
