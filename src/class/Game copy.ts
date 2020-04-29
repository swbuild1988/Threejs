import * as THREE from 'three'
const ThreeBSP = require('tthreebsp')(THREE)
import {
    OrbitControls
} from 'three-orbitcontrols-ts'
import {
    ThreeOption
} from '@/class/ThreeOption'

export class Game {
    private _scene!: THREE.Scene
    private _camera!: THREE.PerspectiveCamera
    private _light!: THREE.DirectionalLight
    private _renderer!: THREE.WebGLRenderer
    private _element: HTMLElement
    private _material!: THREE.MeshBasicMaterial
    private _geometry!: THREE.BoxGeometry
    private _box!: THREE.Mesh
    private _controls!: OrbitControls
    private _gameObject: THREE.Mesh[] = []
    private _boxes: ThreeOption[] = []

    public constructor(element: HTMLElement) {
        this._element = element

        this.initTreejs()
        this.initControls()
    }

    private initTreejs(): void {
        this._scene = new THREE.Scene()
        this._camera = new THREE.PerspectiveCamera(75, this._element.offsetWidth / this._element.offsetHeight, 0.1, 10000)

        this._camera.position.set(0, 600, -1500)
        this._camera.lookAt(this._scene.position)

        this._light = new THREE.DirectionalLight(0xffffff)
        this._light.position.set(0, 1, 1).normalize()
        this._scene.add(this._light)

        this._renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        })

        this._geometry = new THREE.BoxGeometry(100, 100, 100)
        let texture: THREE.Texture = new THREE.TextureLoader().load(require('@/assets/crate.jpg'))
        this._material = new THREE.MeshLambertMaterial({
            map: texture
        })
        this._box = new THREE.Mesh(this._geometry, this._material)
        this._scene.add(this._box)
    }

    private initControls(): void {

        // 添加控制
        this._controls = new OrbitControls(this._camera, this._renderer.domElement)
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

    public createScene(): void {
        this._renderer.setSize(this._element.offsetWidth, this._element.offsetHeight)
        this._element.appendChild(this._renderer.domElement)

        // 添加地板
        this.createFloor()

        // 添加台阶
        this.createStep()

        // 将所有的对象添加到场景中
        this._gameObject.forEach((object: THREE.Mesh) => {
            this._scene.add(object)
        })

        this._renderer.render(this._scene, this._camera)
        this.animate()
    }

    /** 动画效果 */
    public animate(): void {

        this._controls.update()

        requestAnimationFrame(this.animate.bind(this))
        this._box.rotation.x += 0.04
        this._box.rotation.y += 0.02
        this._renderer.render(this._scene, this._camera)
    }

    /** 添加地板 */
    private createFloor(): void {
        let floor: ThreeOption = new ThreeOption({
            _name: '地板',
            _width: 1600,
            _height: 10,
            _depth: 1300,
            _color: '#BEC9BE',
            _textureUrl: 'floor',
            _textureRepeat: 10
        })
        this._boxes.push(floor)
        this.makeBoxGeometry(floor)
    }

    /** 添加台阶 */
    private createStep(): void {
        let step: ThreeOption = new ThreeOption({
            _name: '台阶',
            _width: 200,
            _height: 20,
            _depth: 260,
            //坐标
            _x: -300,
            _y: 10,
            _z: 600,
            _xRotation: 3,
            _op: '-',
        })
        this._boxes.push(step)
        this.makeBoxGeometry(step)
    }

    /** 生成盒子 */
    private makeBoxGeometry(config: ThreeOption): void {
        // 立方体几何图形
        let geomtry: THREE.BoxGeometry = new THREE.BoxGeometry(config.width, config.height, config.depth)
        let material = new THREE.MeshLambertMaterial({
            color: config.color
        })
        // 加载纹理贴图
        if (config.textureUrl.length > 0) {
            let texture: THREE.Texture = new THREE.TextureLoader().load(require(`@/assets/${config.textureUrl}.png`))
            texture.wrapS = THREE.RepeatWrapping
            texture.wrapT = THREE.RepeatWrapping
            texture.repeat.set(config.textureRepeat, config.textureRepeat)
            material.map = texture
        }
        // 几何模型
        let mesh: THREE.Mesh = new THREE.Mesh(geomtry, material)
        mesh.position.x = config.x
        mesh.position.y = config.y
        mesh.position.z = config.z
        mesh.rotation.x = config.xRotation * Math.PI / 180
        mesh.rotation.y = config.yRotation * Math.PI / 180
        mesh.rotation.z = config.zRotation * Math.PI / 180
        mesh.castShadow = config.castShadow
        console.log("mesh", mesh)

        /**
         * 如果已经有了对象，则对其进行各种处理
         * subtract 差集 '-'
         * union    并集 ''
         * interset 交集 '+'
         */
        if (config.op == '-') {
            let last: THREE.Mesh | undefined = this._gameObject.pop()
            if (last) {
                console.log("last1", last)
                const bsp1 = new ThreeBSP(last)
                const bsp2 = new ThreeBSP(mesh)
                //开始计算从bsp1减去bsp2后的BSP对象
                const BSP = bsp1.subtract(bsp2)
                //获取结算结果中的geometry对象
                let tmp: THREE.Mesh = BSP.toMesh()
                console.log("last2", last)
                tmp.material = last.material
                this._gameObject.push(tmp)
            } else { // gameobject为空
                this._gameObject.push(mesh)
            }
        } else if (config.op == '+') {
            let last: THREE.Mesh | undefined = this._gameObject.pop()
            if (last) {
                const bsp1 = new ThreeBSP(last)
                const bsp2 = new ThreeBSP(mesh)
                //开始计算从bsp1减去bsp2后的BSP对象
                const BSP = bsp1.union(bsp2)
                //获取结算结果中的geometry对象
                let tmp: THREE.Mesh = BSP.toMesh()
                tmp.material = last.material
                this._gameObject.push(tmp)
            } else { // gameobject为空
                this._gameObject.push(mesh)
            }
        } else {
            this._gameObject.push(mesh)
        }

    }
}