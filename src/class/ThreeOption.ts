export class ThreeOption {
    public name: string
    /** 长，对应x */
    public width: number
    /** 宽，对应y */
    public height: number
    /** 高，对应z */
    public depth: number
    /** 颜色 */
    public color: string
    /** 所在位置x */
    public x: number
    /** 所在位置y */
    public y: number
    /** 所在位置z */
    public z: number
    /** x轴旋转角度 */
    public xRotation: number
    /** y轴旋转角度 */
    public yRotation: number
    /** z轴旋转角度 */
    public zRotation: number
    /** 投射阴影 */
    public castShadow: boolean
    /** 接收投影 */
    public receiveShadow: boolean
    /** 透明 */
    public transparent: boolean
    /** 透明度 */
    public opacity: number
    /** 贴纸 */
    public textureUrl: string
    /** 贴纸重复 */
    public textureRepeat: number
    /** 运算（集合“+”或者删除“-”） */
    public op: string
    /** 运算的父亲名 */
    public fatherName: string
    /** 路径 */
    public paths: number[][]

    public constructor({
        _name = '',
        _width = 10,
        _height = 10,
        _depth = 10,
        _color = '#aaaaaa',
        _x = 0,
        _y = 0,
        _z = 0,
        _xRotation = 0,
        _yRotation = 0,
        _zRotation = 0,
        _castShadow = true,
        _receiveShadow = true,
        _transparent = true,
        _opacity = 0.5,
        _textureUrl = '',
        _textureRepeat = 1,
        _op = '',
        _fatherName = '',
        _paths = [],
    }: {
        _name ? : string,
        _width ? : number,
        _height ? : number,
        _depth ? : number,
        _color ? : string,
        _x ? : number,
        _y ? : number,
        _z ? : number,
        _xRotation ? : number,
        _yRotation ? : number,
        _zRotation ? : number,
        _castShadow ? : boolean,
        _receiveShadow ? : boolean,
        _transparent ? : boolean,
        _opacity ? : number,
        _textureUrl ? : string,
        _textureRepeat ? : number,
        _op ? : string,
        _fatherName ? : string,
        _paths ? : number[][]
    }) {
        this.name = _name
        this.width = _width
        this.height = _height
        this.depth = _depth
        this.color = _color
        this.x = _x
        this.y = _y
        this.z = _z
        this.xRotation = _xRotation
        this.yRotation = _yRotation
        this.zRotation = _zRotation
        this.castShadow = _castShadow
        this.receiveShadow = _receiveShadow
        this.transparent = _transparent
        this.opacity = _opacity
        this.textureUrl = _textureUrl
        this.textureRepeat = _textureRepeat
        this.op = _op
        this.fatherName = _fatherName
        this.paths = _paths
    }
}