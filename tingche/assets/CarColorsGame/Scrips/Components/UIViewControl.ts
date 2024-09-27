import { _decorator, AnimationClip, Component, Node, Animation } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UIViewControl')
export class UIViewControl extends Component {
    @property(Animation)
    animation: Animation = null
    @property(AnimationClip)
    showClip: AnimationClip = null
    @property(AnimationClip)
    hideClip: AnimationClip = null

    status: string = "hide" // hide, show

    show(opts?:any){
        this.status = "show"
        this.node.active = true
        if (this.animation !== null){
            this.animation.stop()
            this.animation.play(this.showClip.name)
        }
    }

    hide(){
        this.status = "hide"
        if (this.animation !== null){
            this.animation.stop()
            this.animation.once(Animation.EventType.FINISHED, ()=>{
                this.node.active = false
                this.node.removeFromParent()
            })
            this.animation.play(this.showClip.name)
        }else {
            
            this.node.active = false
            this.node.removeFromParent()
        }
    }
    refreshUI(){}
}




