import { _decorator, Component, Node, Font, BitmapFont, Vec2, ImageAsset, Texture2D, Asset, RenderTexture, MeshRenderer, Material, Vec3, Size, utils, geometry, EventHandler, Color, ccenum, isValid } from 'cc';
const { ccclass, property, executeInEditMode } = _decorator;

export enum FontFilter {
    None,
    Blur,
    Gray,
}
ccenum(FontFilter)


export const BASELINE_RATIO = 0.26;
const MAX_SIZE = 2048;
@ccclass('Label3D')
@executeInEditMode
export class Label3D extends Component {
    /**
     * 显示文字
     * Arial,serif, 仿宋、黑体、华文彩云、华文细黑、华文新魏、华文行楷、华文中宋、楷体、隶书、幼圆
     */
    @property
    private _font: string = "serif";
    @property({ displayOrder: 0, displayName: "字体" })
    get font() {
        return this._font;
    }
    set font(val) {
        if (this._font === val) {
            return;
        }
        this._font = val;
        if (this._font.length <= 0) {
            this._font = "serif";
        }
        this.updateRenderData();
    }
    /**
     * 显示文字
     */
    @property
    private _string: string = "";
    @property({ displayOrder: 1, multiline: true, displayName: "文字" })
    get string() {
        return this._string;
    }
    set string(val) {
        if (val === null || val === undefined) {
            val = '';
        } else {
            val = val.toString();
        }
        if (this._string === val) {
            return;
        }
        this._string = val;
        this.updateRenderData();
    }
    private _fontSize: number = 50;
    @property
    private _color: Color = new Color();
    @property({ displayOrder: 2, displayName: "字体颜色" })
    get color() {
        return this._color;
    }
    set color(val) {
        this._color = val;
        this.updateRenderData();
    }
    @property
    private _lineHeight: number = 0;
    @property({ displayOrder: 3, displayName: "行高" })
    get lineHeight() {
        return this._lineHeight;
    }
    set lineHeight(val) {
        this._lineHeight = val;
        this.updateRenderData();
    }
    @property
    _strokeWidth: number = 2;
    @property({ displayOrder: 4, displayName: "描边宽度" })
    get strokeWidth() {
        return this._strokeWidth;
    }
    set strokeWidth(val) {
        this._strokeWidth = val;
        if (this._strokeWidth < 0) {
            this._strokeWidth = 0;
        }
        this.updateRenderData();
    }
    @property
    private _strokeColor: Color = new Color();
    @property({ displayOrder: 5, displayName: "描边颜色" })
    get strokeColor() {
        return this._strokeColor;
    }
    set strokeColor(val) {
        this._strokeColor = val;
        this.updateRenderData();
    }
    @property
    _shadowSize: number = 0;
    @property({ displayOrder: 6, displayName: "阴影大小" })
    get shadowSize() {
        return this._shadowSize;
    }
    set shadowSize(val) {
        this._shadowSize = val;
        if (this._shadowSize < 0) {
            this._shadowSize = 0;
        }
        this.updateRenderData();
    }
    @property
    private _shadowColor: Color = new Color();
    @property({ displayOrder: 7, displayName: "阴影颜色" })
    get shadowColor() {
        return this._shadowColor;
    }
    set shadowColor(val) {
        this._shadowColor = val;
        this.updateRenderData();
    }
    @property
    private _filter: number = FontFilter.None;
    @property({ type: FontFilter, displayOrder: 8, displayName: "滤镜" })
    get filter() {
        return this._filter;
    }
    set filter(val) {
        this._filter = val;
        this.updateRenderData();
    }
    @property
    private _blurLenght: number = 5;
    @property({ displayOrder: 9, displayName: "模糊强度", range: [0, 10], step: 0.01, slide: true, visible: function (this) { return this._filter === FontFilter.Blur ? true : false; } })
    get blurLenght() {
        return this._blurLenght;
    }
    set blurLenght(val) {
        this._blurLenght = val;
        this.updateRenderData();
    }
    @property
    private _grayLenght: number = 5;
    @property({ displayOrder: 10, displayName: "置灰强度", range: [0, 100], step: 1, slide: true, visible: function (this) { return this._filter === FontFilter.Gray ? true : false; } })
    get grayLenght() {
        return this._grayLenght;
    }
    set grayLenght(val) {
        this._grayLenght = val;
        this.updateRenderData();
    }

    private _splitStrings: string[] = [];
    private _context: CanvasRenderingContext2D = null!
    private _canvas: HTMLCanvasElement = null!;
    private _texture: Texture2D = null!;
    private _meshRender: MeshRenderer = null!;
    private _canvasSize: Size = new Size();
    /**
     * mesh uvs
     */
    private _uvs: number[] = [];
    /**
     * mesh 顶点坐标
     */
    private _positions: number[] = [];

    private _startPosition: Vec2 = new Vec2();

    onLoad() {
        this.initRenderingContext();
        this.initMeshRender();
        this.initTexture2D();
        this.updateRenderData();
    }
    onEnable() {
    }
    start() {
    }
    private initRenderingContext(): void {
        this._canvas = document.createElement('canvas');
        this._context = this._canvas.getContext('2d');
    }
    private initMeshRender(): void {
        this._meshRender = this.node.getComponent(MeshRenderer)!;
        if (!this._meshRender) {
            this._meshRender = this.node.addComponent(MeshRenderer);
        }
    }
    private initTexture2D(): void {
        this._texture = new Texture2D();
        let image: ImageAsset = new ImageAsset(this._canvas);
        this._texture.image = image;

    }
    /**
     * 刷新渲染
     */
    private updateRenderData(): void {
        this.resetRenderData();
        this.updateProperties();
        this.updateTexture();
        this.updateRenderMesh();
        this.updateMaterial();
    }
    private updateProperties(): void {
        //设置canvas 的宽和高
        this._splitStrings = this._string.split("\\n");
        for (let i = 0; i < this._splitStrings.length; i++) {
            //获取文本的宽度
            let len: number = this._context.measureText(this._splitStrings[i]).width;
            if (len > this._canvasSize.width) {
                this._canvasSize.width = len;
            }

        }
        this._canvasSize.height = this._splitStrings.length * this.getLineHeight() + BASELINE_RATIO * this.getLineHeight();
        this._canvasSize.width = Math.min(this._canvasSize.width, MAX_SIZE);
        this._canvasSize.height = Math.min(this._canvasSize.height, MAX_SIZE);
        if (this._canvas.width != this._canvasSize.width) {
            this._canvas.width = this._canvasSize.width;
        }
        if (this._canvas.height != this._canvasSize.height) {
            this._canvas.height = this._canvasSize.height;
        }
        //设置字体样式
        this._context.font = "bold " + this._fontSize + "px " + "Arial";
        // this._context.
        this._context.lineWidth = this._strokeWidth;
        this._context.fillStyle = "#" + this._color.toHEX();
        this._context.strokeStyle = "#" + this._strokeColor.toHEX();
        this._context.shadowBlur = this._shadowSize;
        this._context.shadowColor = "#" + this._shadowColor.toHEX();
        if (this._filter === FontFilter.Blur) {
            this._context.filter = "blur(" + this._blurLenght + "px)";
        } else if (this._filter === FontFilter.Gray) {
            this._context.filter = "grayscale(" + this._grayLenght + "%)";
        } else {
            this._context.filter = "none";
        }
    }

    private updateTexture(): void {
        if (!this._context || !this._canvas) return;
        this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
        let textPosX: number = 0;
        let textPosY: number = 0;
        for (let i = 0; i < this._splitStrings.length; i++) {
            textPosY = this._startPosition.y + (i + 1) * this.getLineHeight();
            let len: number = this._context.measureText(this._splitStrings[i]).width;
            textPosX = (this._canvas.width - len) / 2;
            this._context.fillText(this._splitStrings[i], textPosX, textPosY);
            if (this._strokeWidth > 0) {
                this._context.strokeText(this._splitStrings[i], textPosX, textPosY);
            }
        }
        let uploadAgain: boolean = this._canvas.width !== 0 && this._canvas.height !== 0;
        if (uploadAgain) {
            this._texture.reset({
                width: this._canvas.width,
                height: this._canvas.height,
                mipmapLevel: 1,
            });
            this._texture.uploadData(this._canvas);
            this._texture.setWrapMode(RenderTexture.WrapMode.CLAMP_TO_EDGE, RenderTexture.WrapMode.CLAMP_TO_EDGE);
        }
    }

    private updateMaterial(): void {
        if (!this._texture) return;
        if (!this._meshRender) return;
        let material: Material = this._meshRender.getMaterialInstance(0)!;
        material.setProperty("mainTexture", this._texture);
    }
    /**
     * 根据canvas的实际宽高
     * 动态的调整mesh的坐标
     */
    private updateRenderMesh(): void {
        let rate: number = this._canvas.width / this._canvas.height;
        this._positions = [];
        this._uvs = [];
        this._positions.push(-0.5 * rate, -0.5, 0); this._uvs.push(0, 1);
        this._positions.push(0.5 * rate, -0.5, 0); this._uvs.push(1, 1);
        this._positions.push(-0.5 * rate, 0.5, 0); this._uvs.push(0, 0);
        this._positions.push(-0.5 * rate, 0.5, 0); this._uvs.push(0, 0);
        this._positions.push(0.5 * rate, -0.5, 0); this._uvs.push(1, 1);
        this._positions.push(0.5 * rate, 0.5, 0); this._uvs.push(1, 0);
        this._meshRender.mesh = utils.MeshUtils.createMesh({
            positions: this._positions,
            uvs: this._uvs,
            minPos: { x: -0.5 * rate, y: -0.5, z: 0 },
            maxPos: { x: 0.5 * rate, y: 0.5, z: 0 }
        });
        this._meshRender.model?.updateWorldBound();
    }
    /**
     * 获取行高
     */
    private getLineHeight(): number {
        return this._fontSize + this._lineHeight; //行高 -暂时写成40 
    }
    private resetRenderData(): void {
        this._canvasSize.width = 0;
        this._canvasSize.height = 0;
        //设置字体样式
        this._context.font = "bold " + this._fontSize + "px " + "Arial";
        this._context.lineWidth = this._strokeWidth;
        this._context.fillStyle = "#" + this._color.toHEX();
        this._context.strokeStyle = "#" + this._strokeColor.toHEX();
        this._context.shadowBlur = this._shadowSize;
        this._context.shadowColor = "#" + this._shadowColor.toHEX();
        if (this._filter === FontFilter.Blur) {
            this._context.filter = "blur(" + this._blurLenght + "px)";
        } else if (this._filter === FontFilter.Gray) {
            this._context.filter = "grayscale(" + this._grayLenght + "%)";
        } else {
            this._context.filter = "none";
        }
    }
    update(deltaTime: number) {

    }

    onDestroy() {
        this._canvas = null;
        this._context = null;
        this._meshRender = null!;
    }
}
