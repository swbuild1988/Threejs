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
    private _renderer!: THREE.WebGLRenderer
    private _element: HTMLElement
    private _material!: THREE.MeshBasicMaterial
    private _geometry!: THREE.BoxGeometry
    private _box!: THREE.Mesh
    private _controls!: OrbitControls
    private _gameObject: THREE.Mesh[] = []
    private _boxes: ThreeOption[] = []
    private _preMesh!: THREE.Mesh
    private _preMaterial!: THREE.Material | THREE.Material[]
    /** 门的运动状态，默认不动 */
    private _doorStatus: boolean = false
    /** 门的方向，1:开，-1:关 */
    private _doorDirection: number = 1
    /** 左门的初始x */
    private _leftDoorInitX: number = 0
    /** 右门的初始x */
    private _rightDoorInitX: number = 0
    /** 门打开的距离 */
    private _doorOpenLength: number = 80
    /** 左门对象 */
    private _leftDoorMesh!: THREE.Mesh
    /** 右门对象 */
    private _rightDoorMesh!: THREE.Mesh

    public constructor(element: HTMLElement) {
        this._element = element

        this.initTreejs()
        this.initLight()
        this.initControls()
    }

    private initTreejs(): void {
        this._scene = new THREE.Scene()
        // initCamera
        this._camera = new THREE.PerspectiveCamera(75, this._element.clientWidth / this._element.clientHeight, 0.1, 10000)
        this._camera.position.set(0, 1000, 800)
        this._camera.lookAt(this._scene.position)
        // 背景透明
        this._renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        })

        // 随便建个盒子玩
        this._geometry = new THREE.BoxGeometry(100, 100, 100)
        let texture: THREE.Texture = new THREE.TextureLoader().load(require('@/assets/crate.jpg'))
        this._material = new THREE.MeshLambertMaterial({
            map: texture
        })
        this._box = new THREE.Mesh(this._geometry, this._material)
        // this._box.position.set(0, 200, 80)
        this._scene.add(this._box)
    }

    private initLight(): void {
        // 平行光，约等于太阳光
        let light1 = new THREE.SpotLight(0xffffff)
        light1.position.set(1000, 1000, 800)
        light1.castShadow = true

        light1.shadow.mapSize.width = 1024
        light1.shadow.mapSize.height = 1024

        light1.shadow.camera.near = 500
        light1.shadow.camera.far = 4000
        light1.shadow.camera.fov = 30

        this._scene.add(light1)

        // 环境光，周围亮一点
        let light2 = new THREE.AmbientLight(0x555555) // soft white light
        this._scene.add(light2)

    }

    /** 初始化控制器 */
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
        /**
         * 因为不知道什么原因，建议将 node_modules/three-orbitcontrols-ts/dist/index.js中的部分
         * if (this.object instanceof THREE.PerspectiveCamera) {
         * 注释掉，改为
         * if (true) {
         * 因为this.object最后识别为 object，导致拖拉、缩放无作用
         */
    }

    public createScene(): void {
        this._renderer.setSize(this._element.offsetWidth, this._element.offsetHeight)
        this._element.appendChild(this._renderer.domElement)
        // 绑定鼠标点击事件
        this._element.addEventListener('mousedown', this.onDocumentMouseDown.bind(this), false)

        this.createFloor()
        this.createStep()
        this.createWall()
        this.createDoor()
        this.createWindow()
        this.createOutWall()
        this.createText()

        // 将所有的对象添加到场景中
        this._gameObject.forEach((object: THREE.Mesh) => {
            this._scene.add(object)
        })

        this._renderer.render(this._scene, this._camera)
        this.animate()
    }

    /** 点击事件 */
    private onDocumentMouseDown(event: MouseEvent): void {

        // 如果已经点过，将上一次变的改回去
        if (this._preMesh && this._preMaterial) {
            this._preMesh.material = this._preMaterial
        }

        event.preventDefault()

        // 射线，用作点击事件
        let raycaster: THREE.Raycaster = new THREE.Raycaster()
        let mouse: THREE.Vector2 = new THREE.Vector2()
        mouse.x = (event.offsetX / this._element.offsetWidth) * 2 - 1
        mouse.y = -(event.offsetY / this._element.offsetHeight) * 2 + 1

        raycaster.setFromCamera(mouse, this._camera)

        let intersects: THREE.Intersection[] = raycaster.intersectObjects(this._scene.children)

        if (intersects.length > 0 && intersects[0].object instanceof THREE.Mesh) {

            // 将点击物保存
            this._preMesh = intersects[0].object
            this._preMaterial = intersects[0].object.material

            var object: THREE.Mesh = intersects[0].object

            if (object.name == '左门' || object.name == '右门') {
                this._doorStatus = !this._doorStatus
            } else {
                // 变色透明
                var material = new THREE.MeshLambertMaterial({
                    color: 0xcc0000,
                    transparent: true,
                    opacity: 0.6
                })
                object.material = material
            }
        }
    }

    /** 动画效果 */
    public animate(): void {

        this._controls.update()

        requestAnimationFrame(this.animate.bind(this))
        this._box.rotation.x += 0.04
        this._box.rotation.y += 0.02

        if (this._doorStatus) {
            let speed = 0.5
            this._leftDoorMesh.position.x += -1 * speed * this._doorDirection
            this._rightDoorMesh.position.x += speed * this._doorDirection
            if (this._leftDoorInitX - this._leftDoorMesh.position.x >= this._doorOpenLength ||
                this._leftDoorMesh.position.x - this._leftDoorInitX > 0) {
                this._doorStatus = false
                this._doorDirection = this._doorDirection * -1
            }

        }

        this._renderer.render(this._scene, this._camera)
    }

    /** 添加地板 */
    private createFloor(): void {
        let floor: ThreeOption = new ThreeOption({
            _name: '地板',
            _width: 1600,
            _height: 10,
            _depth: 1300,
            _y: -5,
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
            _y: 5,
            _z: 600,
            _xRotation: 3,
            _op: '-',
        })
        this._boxes.push(step)
        this.makeBoxGeometry(step)
    }

    /** 添加围墙 */
    private createWall(): void {
        let wall: ThreeOption = new ThreeOption({
            _name: '围墙',
            _width: 10,
            _height: 200,
            _color: '#BCD2EE',
            _paths: [
                [0, 0],
                [500, 0],
                [500, 500],
                [-500, 500],
                [-500, -500],
                [0, -500],
                [0, 0]
            ],
            _xRotation: 270,
            _zRotation: 90
        })
        this._boxes.push(wall)
        /** 挤压几何生成实心的立方体，不符合要求
         * this.makeExtrudeGeometry(wall)
         */

        // 根据多个路径生成多个盒子
        for (let i = 0; i < wall.paths.length - 1; i++) {
            let start: number[] = wall.paths[i]
            let end: number[] = wall.paths[i + 1]
            let tmpWall: ThreeOption = new ThreeOption({
                _name: "墙" + i,
                _height: wall.height,
                _width: start[0] == end[0] ? wall.width : Math.abs(start[0] - end[0]) + wall.width,
                _depth: start[1] == end[1] ? wall.width : Math.abs(start[1] - end[1]) + wall.width,
                _color: wall.color,
                _x: (start[0] + end[0]) / 2 + wall.x,
                _y: wall.y + wall.height / 2,
                _z: (start[1] + end[1]) / 2 + wall.z,
                _op: i == 0 ? '' : '+',
            })
            this.makeBoxGeometry(tmpWall)
        }


        //先挖个洞--门框一样大的洞
        let doorHole: ThreeOption = new ThreeOption({
            _name: '门洞',
            _width: 220,
            _height: 190,
            _depth: 20,
            _x: -300,
            _y: 95,
            _z: 500,
            _op: '-',
        })
        this._boxes.push(doorHole)
        this.makeBoxGeometry(doorHole)

        //先挖个洞--窗户洞一样大的洞
        let windowHole: ThreeOption = new ThreeOption({
            _name: '窗洞',
            _width: 420,
            _height: 150,
            _depth: 20,
            _x: 150,
            _y: 110,
            _z: 500,
            _op: '-',
        })
        this._boxes.push(windowHole)
        this.makeBoxGeometry(windowHole)

    }

    /** 添加门 */
    private createDoor(): void {
        // 添加门框，比门稍微大点
        let doorFrame: ThreeOption = new ThreeOption({
            _name: '门框',
            _width: 220,
            _height: 190,
            _depth: 20,
            _color: "#eeeeee",
            _x: -300,
            _y: 95,
            _z: 500,
        })
        this._boxes.push(doorFrame)
        this.makeBoxGeometry(doorFrame)

        // 添加门（实际就是在门框里挖个洞）
        let door: ThreeOption = new ThreeOption({
            _name: '门',
            _width: 205,
            _height: 180,
            _depth: 20,
            _x: -300,
            _y: 95,
            _z: 500,
            _op: '-',
        })
        this._boxes.push(door)
        this.makeBoxGeometry(door)

        let leftDoor: ThreeOption = new ThreeOption({
            _name: '左门',
            _width: 100,
            _height: 180,
            _depth: 5,
            _x: -350,
            _y: 95,
            _z: 500,
            _textureUrl: 'door-left',
            _transparent: true
        })
        this._boxes.push(leftDoor)
        this.makeBoxGeometry(leftDoor)
        this._leftDoorMesh = this._gameObject[this._gameObject.length - 1]
        this._leftDoorInitX = this._leftDoorMesh.position.x

        let rightDoor: ThreeOption = new ThreeOption({
            _name: '右门',
            _width: 100,
            _height: 180,
            _depth: 5,
            _color: '#999999',
            _x: -250,
            _y: 95,
            _z: 500,
            _textureUrl: 'door-right',
            _transparent: true
        })
        this._boxes.push(rightDoor)
        this.makeBoxGeometry(rightDoor)
        this._rightDoorMesh = this._gameObject[this._gameObject.length - 1]
        this._rightDoorInitX = this._rightDoorMesh.position.x
    }

    /** 添加窗户 */
    private createWindow(): void {
        //添加窗台
        let windowSill: ThreeOption = new ThreeOption({
            _name: '窗台',
            _width: 420,
            _height: 15,
            _depth: 30,
            _color: '#ffffff',
            _x: 150,
            _y: 35,
            _z: 510,
        })
        this._boxes.push(windowSill)
        this.makeBoxGeometry(windowSill)
        //添加窗户玻璃
        let window: ThreeOption = new ThreeOption({
            _name: '窗户',
            _width: 420,
            _height: 150,
            _depth: 5,
            _color: '#0000ff',
            _x: 150,
            _y: 110,
            _z: 500,
            _transparent: true,
            _opacity: 0.4
        })
        this._boxes.push(window)
        this.makeBoxGeometry(window)
    }

    /** 添加外墙 */
    private createOutWall(): void {
        let outwall1: ThreeOption = new ThreeOption({
            _name: "外墙1",
            _width: 10,
            _height: 200,
            _depth: 1300,
            _x: -795,
            _y: 100,
            _color: '#BCD2EE'
        })
        this._boxes.push(outwall1)
        this.makeBoxGeometry(outwall1)
        //先挖个洞--窗户
        let windowHole1: ThreeOption = new ThreeOption({
            _name: '外窗洞1',
            _width: 10,
            _height: 100,
            _depth: 1300,
            _x: -795,
            _y: 120,
            _op: '-',
        })
        this._boxes.push(windowHole1)
        this.makeBoxGeometry(windowHole1)
        //再安窗户
        let window1: ThreeOption = new ThreeOption({
            _name: '外窗1',
            _width: 5,
            _height: 100,
            _depth: 1300,
            _color: '#0000ff',
            _x: -795,
            _y: 120,
            _transparent: true,
            _opacity: 0.4
        })
        this._boxes.push(window1)
        this.makeBoxGeometry(window1)


        let outwall2: ThreeOption = new ThreeOption({
            _name: "外墙2",
            _width: 10,
            _height: 200,
            _depth: 1300,
            _x: 795,
            _y: 100,
            _color: '#BCD2EE'
        })
        this._boxes.push(outwall2)
        this.makeBoxGeometry(outwall2)
        //先挖个洞--窗户
        let windowHole2: ThreeOption = new ThreeOption({
            _name: '外窗洞2',
            _width: 10,
            _height: 100,
            _depth: 1300,
            _x: 795,
            _y: 120,
            _op: '-',
        })
        this._boxes.push(windowHole2)
        this.makeBoxGeometry(windowHole2)
        //再安窗户
        let window2: ThreeOption = new ThreeOption({
            _name: '外窗2',
            _width: 5,
            _height: 100,
            _depth: 1300,
            _color: '#0000ff',
            _x: 795,
            _y: 120,
            _transparent: true,
            _opacity: 0.4
        })
        this._boxes.push(window2)
        this.makeBoxGeometry(window2)
    }

    /** 添加裱字 */
    private createText(): void {
        // 添加门（实际就是在门框里挖个洞）
        let text: ThreeOption = new ThreeOption({
            _name: '裱字',
            _width: 150,
            _height: 60,
            _depth: 5,
            _x: -250,
            _y: 130,
            _z: -495,
            _color: '#ffffff',
            _textureUrl: 'text',
        })
        this._boxes.push(text)
        this.makeBoxGeometry(text)
    }

    /** 生成盒子 */
    private makeBoxGeometry(config: ThreeOption): void {
        // 立方体几何图形
        let geometry: THREE.BoxGeometry = new THREE.BoxGeometry(config.width, config.height, config.depth)
        let material: THREE.MeshLambertMaterial = new THREE.MeshLambertMaterial({
            color: config.color,
            transparent: config.transparent,
            opacity: config.opacity,
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
        let mesh: THREE.Mesh = new THREE.Mesh(geometry, material)
        mesh.name = config.name
        mesh.position.set(config.x, config.y, config.z)
        mesh.rotation.x = config.xRotation * Math.PI / 180
        mesh.rotation.y = config.yRotation * Math.PI / 180
        mesh.rotation.z = config.zRotation * Math.PI / 180
        mesh.castShadow = config.castShadow

        /**
         * 如果已经有了对象，则对其进行各种处理
         * subtract 差集 '-'
         * union    并集 ''
         * interset 交集 '+'
         */
        if (config.op == '-') {
            let last: THREE.Mesh | undefined = this._gameObject.pop()
            if (last) {
                const bsp1 = new ThreeBSP(last)
                const bsp2 = new ThreeBSP(mesh)
                //开始计算从bsp1减去bsp2后的BSP对象
                const BSP = bsp1.subtract(bsp2)
                //获取结算结果中的geometry对象
                let tmp: THREE.Mesh = BSP.toMesh()
                tmp.name = last.name
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
                tmp.name = last.name
                tmp.material = last.material
                this._gameObject.push(tmp)
            } else { // gameobject为空
                this._gameObject.push(mesh)
            }
        } else {
            this._gameObject.push(mesh)
        }

    }

    /** 生成挤压几何体（根据路径生成三维） */
    private makeExtrudeGeometry(config: ThreeOption): void {
        // 路径
        let shape: THREE.Shape = new THREE.Shape()
        for (let i = 0; i < config.paths.length; i++) {
            let path: number[] = config.paths[i]
            if (i == 0) {
                shape.moveTo(path[0], path[1])
            } else {
                shape.lineTo(path[0], path[1])
            }
        }

        // 参数
        var extrudeSettings: THREE.ExtrudeGeometryOptions = {
            steps: 200,
            depth: config.height,
            bevelEnabled: true,
            bevelThickness: 1,
            bevelSize: 1,
            bevelOffset: 0,
            bevelSegments: 1
        }

        let geometry: THREE.ExtrudeGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)
        let material: THREE.MeshLambertMaterial = new THREE.MeshLambertMaterial({
            color: config.color
        })

        // 几何模型
        let mesh: THREE.Mesh = new THREE.Mesh(geometry, material)
        mesh.position.x = config.x
        mesh.position.y = config.y
        mesh.position.z = config.z
        mesh.rotation.x = config.xRotation * Math.PI / 180
        mesh.rotation.y = config.yRotation * Math.PI / 180
        mesh.rotation.z = config.zRotation * Math.PI / 180
        mesh.castShadow = config.castShadow
        this._gameObject.push(mesh)
    }
}