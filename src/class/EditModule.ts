import * as THREE from 'three'
import {
    RenderPass
} from 'three/examples/jsm/postprocessing/RenderPass'
import {
    EffectComposer
} from 'three/examples/jsm/postprocessing/EffectComposer'
import {
    OutlinePass
} from 'three/examples/jsm/postprocessing/OutlinePass'
import {
    MTLLoader
} from 'three/examples/jsm/loaders/MTLLoader'
import {
    OBJLoader
} from 'three/examples/jsm/loaders/OBJLoader'
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'
import {
    GUI
} from 'dat.gui'
const ThreeBSP = require('tthreebsp')(THREE)
import {
    ThreeOption
} from '@/class/ThreeOption'

/** 编辑模块 */
export class EditModule {
    /** 三维模型所在的dom */
    protected _element!: HTMLElement
    /** 场景 */
    protected _scene!: THREE.Scene
    /** 相机，采用透视相机 */
    protected _camera!: THREE.PerspectiveCamera
    /** 渲染器 */
    protected _renderer!: THREE.WebGLRenderer
    /** 控制器，控制相机视角位置等 */
    protected _controls!: OrbitControls
    /** 性能插件 */
    protected _stats!: Stats
    /** 控制工具 */
    protected _datGui!: GUI
    /** 控制工具参数 */
    protected _gui!: any
    /** 点击选择的对象，高亮显示 */
    protected _selectObjects: THREE.Object3D[] = []

    /** 待添加的三维对象 */
    protected _preAddObj!: THREE.Object3D

    /** 构造 */
    public constructor(element: HTMLElement) {
        this._element = element

        this.initTreejs()
        this.initLight()
        this.initControls()
        this.initStats()
        this.initGUI()
    }

    /** 初始化Threejs的东西，包括场景、相机等 */
    private initTreejs(): void {
        this._scene = new THREE.Scene()
        // 初始化相机
        this._camera = new THREE.PerspectiveCamera(75, this._element.clientWidth / this._element.clientHeight, 0.1, 100000)
        this._camera.position.set(-500, 1000, 800)
        this._camera.lookAt(this._scene.position)

        // 初始化渲染器，背景透明
        this._renderer = new THREE.WebGLRenderer({
            // antialias: true,
            // alpha: true
        })
        this._renderer.setPixelRatio(window.devicePixelRatio)
        this._renderer.setSize(this._element.offsetWidth, this._element.offsetHeight)

        // 支持阴影
        this._renderer.shadowMap.enabled = true
        this._renderer.shadowMap.type = THREE.PCFSoftShadowMap
        this._element.appendChild(this._renderer.domElement)

        // 添加坐标轴
        let helper: THREE.AxesHelper = new THREE.AxesHelper(500)
        this._scene.add(helper)
    }

    private initLight(): void {
        // 补充环境光，使周围亮一点
        this._scene.add(new THREE.AmbientLight(0xffffff))
    }

    /** 初始化控制器 */
    private initControls(): void {

        // 添加控制
        this._controls = new OrbitControls(this._camera, this._renderer.domElement)
        // 鼠标阻尼
        this._controls.dampingFactor = 0.25
        // How far you can orbit vertically, upper and lower limits.
        this._controls.minPolarAngle = 0
        this._controls.maxPolarAngle = Math.PI
        // How far you can dolly in and out ( PerspectiveCamera only )
        this._controls.minDistance = 0
        this._controls.maxDistance = Infinity
        // 使动画循环使用时阻尼或自转 意思是否有惯性 
        this._controls.enableDamping = true
        //缩放 
        this._controls.enableZoom = true
        this._controls.zoomSpeed = 1.0
        //右键拖拽 
        this._controls.enablePan = true
    }

    /** 初始化性能插件 */
    private initStats() {
        this._stats = Stats()
        this._stats.dom.style.position = 'absolute'
        this._stats.dom.style.left = this._element.offsetLeft + 'px'
        this._stats.dom.style.top = this._element.offsetTop + 'px'
        this._element.appendChild(this._stats.dom)
    }

    /** 初始化dat.GUI简化试验流程 */
    private initGUI() {
        //声明一个保存需求修改的相关数据的对象
        this._gui = {
            lightY: 30, //灯光y轴的位置
            sphereX: 0, //球的x轴的位置
            sphereZ: 0, //球的z轴的位置
            cubeX: 25, //立方体的x轴位置
            cubeZ: -5 //立方体的z轴的位置
        }

        this._datGui = new GUI();

        this._datGui.domElement.style.position = 'absolute'
        this._datGui.domElement.style.left = (this._element.offsetLeft + this._element.offsetWidth - this._datGui.domElement.offsetWidth) + 'px'
        this._datGui.domElement.style.top = this._element.offsetTop + 'px'
        //将设置属性添加到gui当中，gui.add(对象，属性，最小值，最大值）
        this._datGui.add(this._gui, "lightY", 0, 100)
        this._datGui.add(this._gui, "sphereX", -30, 30)
        this._datGui.add(this._gui, "sphereZ", -30, 30)
        this._datGui.add(this._gui, "cubeX", 0, 60)
        this._datGui.add(this._gui, "cubeZ", -30, 30)
    }

    /** 绘制3D */
    public draw(): void {
        // 绑定鼠标点击事件
        this._element.addEventListener('mousedown', this.onDocumentMouseDown.bind(this), false)

        this.animate()
    }

    /** 动画效果 */
    private animate(): void {
        this._renderer.render(this._scene, this._camera)
        this._controls.update()
        this._stats.update()

        requestAnimationFrame(this.animate.bind(this))
    }

    /** 点击事件 */
    private onDocumentMouseDown(event: MouseEvent): void {

        this._selectObjects.pop()
        event.preventDefault()

        // 射线，用作点击事件
        let raycaster: THREE.Raycaster = new THREE.Raycaster()
        let mouse: THREE.Vector2 = new THREE.Vector2()
        mouse.x = (event.offsetX / this._element.offsetWidth) * 2 - 1
        mouse.y = -(event.offsetY / this._element.offsetHeight) * 2 + 1

        raycaster.setFromCamera(mouse, this._camera)

        let intersects: THREE.Intersection[] = raycaster.intersectObjects(this._scene.children)

        if (intersects.length > 0 && intersects[0].object instanceof THREE.Mesh) {
            this._selectObjects.push(intersects[0].object)
        }
    }

    /** 准备添加 */
    public readyToAdd() {
        // 立方体几何图形
        let geometry: THREE.BoxGeometry = new THREE.BoxGeometry(100, 100, 100)
        // 材质
        let material: THREE.MeshLambertMaterial = new THREE.MeshLambertMaterial({
            color: 0xaaaaaa
        })
        // 几何模型
        this._preAddObj = new THREE.Mesh(geometry, material)

        this._scene.add(this._preAddObj)
    }

    /** 确认添加 */
    public addSure() {
        this._scene.remove(this._preAddObj)
        this._scene.add(this._preAddObj.clone())
    }

    /** 取消添加 */
    public addCancle() {
        this._scene.remove(this._preAddObj)
    }


}