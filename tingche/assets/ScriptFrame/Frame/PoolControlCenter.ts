import { _decorator, Prefab, Node, instantiate, NodePool } from "cc";
const { ccclass, property } = _decorator;
//对象池管理脚本
@ccclass("PoolControlCenter")
export class PoolControlCenter {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    private _dictPool: any = {}
    private _dictPrefab: any = {}

    static _instance: PoolControlCenter;
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    static get instance() {
        if (this._instance) {
            return this._instance;
        }

        this._instance = new PoolControlCenter();
        return this._instance;
    }

    /**
     * 根据预设从对象池中获取对应节点
     */
    public getNode(prefab: Prefab, parent: Node) {
        let name = prefab.name;
        //@ts-ignore
        if (!prefab.position) {
            //@ts-ignore
            name = prefab.data.name;
        }

        this._dictPrefab[name] = prefab;
        let node: Node = null!;
        if (this._dictPool.hasOwnProperty(name)) {
            //已有对应的对象池
            let pool = this._dictPool[name];
            if (pool.size() > 0) {
                node = pool.get();
            } else {
                node = instantiate(prefab);
            }
        } else {
            //没有对应对象池，创建他！
            let pool = new NodePool();
            this._dictPool[name] = pool;

            node = instantiate(prefab);
        }

        node.parent = parent;
        node.active = true;
        return node;
    }

    /**
     * 将对应节点放回对象池中
     */
    public putNode(node: Node) {
        if (!node) {
            return;
        }
        let name = node.name;
        let pool = null;
        if (this._dictPool.hasOwnProperty(name)) {
            //已有对应的对象池
            pool = this._dictPool[name];
        } else {
            //没有对应对象池，创建他！
            pool = new NodePool();
            this._dictPool[name] = pool;
        }
        if (node.parent){
            node.removeFromParent()
        }
        node.active = false
        pool.put(node);
    }

    /**
     * 根据名称，清除对应对象池
     */
    public clearPool(name: string) {
        if (this._dictPool.hasOwnProperty(name)) {
            let pool = this._dictPool[name];
            pool.clear();
        }
    }

    /**
    * 预生成对象池
    * @param prefab 
    * @param nodeNum 
    * 使用——PoolControlCenter.instance.prePool(prefab, 40);
    */
    public prePool(prefab: Prefab, nodeNum: number) {
        const name = prefab.name;

        let pool = new NodePool();
        this._dictPool[name] = pool;
        this._dictPrefab[name] = prefab;

        for (let i = 0; i < nodeNum; i++) {
            const node = instantiate(prefab);
            node.active = false
            pool.put(node);
        }
    }

    public getNodeByName(name: string, parent?: Node){
        // console.log(name)
        let node: Node = null!;
        if (this._dictPool.hasOwnProperty(name)) {
            //已有对应的对象池
            let pool = this._dictPool[name];
            if (pool.size() > 0) {
                node = pool.get();
            } else {
                node = instantiate(this._dictPrefab[name]);
            }

        } else if (this._dictPrefab.hasOwnProperty(name)) {
            //没有对应对象池，但是又预制体
            let pool = new NodePool();
            this._dictPool[name] = pool;

            node = instantiate(this._dictPrefab[name]);
        }else {
            return null
        }

        if (parent){
            node.parent = parent;
        }
        node.active = true;
        return node;
    }
}
