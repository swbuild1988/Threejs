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
    /** 点击选择的对象，高亮显示 */
    protected _selectObjects: THREE.Object3D[] = []

    /** 构造 */
    public constructor(element: HTMLElement) {
        this._element = element

        this.initTreejs()
        this.initControls()
        this.initStats()
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


}