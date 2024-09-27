import { _decorator, Component, instantiate, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ToastSysterm')
export class ToastSysterm extends Component {
    @property(Node)
    item: Node = null

    showToast(content: string, time: number = 2){
        const toast = instantiate(this.item)
        toast.getComponentInChildren(Label).string = content
        toast.active = true
        this.node.addChild(toast)

        this.scheduleOnce(()=>{
            toast.removeFromParent()
            toast.destroy()
        }, time)
    }
}


