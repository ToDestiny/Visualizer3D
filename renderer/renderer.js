import * as THREE from 'three'
import GLTFLoader from 'three-gltf-loader'

export default class Renderer {
    constructor(container) {
        this.container = container
        this.rotation_y = 0
        this.rotation_x = 0
        this.width = 600 // window.innerWidth
        this.height = 400 // window.innerHeight
        this.viewAngle = 75
        const loader = new GLTFLoader()
        console.log('Loading scene')
        loader.load('/t-shirt2/scene.gltf', (gltf) => {
            console.log('Scene loaded')
            const model = gltf.scene
            const factor = 0.05
            model.scale.x = factor
            model.scale.y = factor
            model.scale.z = factor
            model.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    child.position.y = -25
                }
            })
            this.initThree(gltf.scene)
            },
            (xhr) => {},
            (error) => {
                console.error('Error while loading scene file', error)
            }
        )
    }
    draggingModeOn () {
        this.isDragging = true
    }
    draggingModeOff () {
        this.isDragging = false
    }
    mouseMove (e) {
        function toRadians(angle) {
            return angle * (Math.PI / 180.0);
        }
        var deltaMove = {x: 0.0, y: 0.0}
        if (this.previousMousePosition)
        {
            deltaMove =  {
                x: e.offsetX - this.previousMousePosition.x,
                y: e.offsetY - this.previousMousePosition.y
            }
        }
        if (this.isDragging) {
            this.rotation_x += deltaMove.y * 0.01
            this.rotation_y += deltaMove.x * 0.01
            var vert_limit = toRadians(45)
            if (this.rotation_x > vert_limit)
                this.rotation_x = vert_limit
            else if (this.rotation_x < -vert_limit)
                this.rotation_x = -vert_limit
            this.model.setRotationFromEuler(new THREE.Euler(
                this.rotation_x,
                this.rotation_y,
                0,
                'XYZ'))
            this.previousMousePosition = {
                x: e.offsetX,
                y: e.offsetY,
            }
            this.renderer.render(this.scene, this.camera)
        }
        else
            this.previousMousePosition = null
    }
    zoomIn(val) {
        if (val > 0)
        {
            this.viewAngle -= val
            if (this.viewAngle < 30)
                this.viewAngle = 30
            this.render()
        }
    }
    zoomOut(val) {
        if (val > 0)
        {
            this.viewAngle += val
            console.log(this.viewAngle)
            if (this.viewAngle > 80)
                this.viewAngle = 80
            this.render()
        }
    }
    render() {
        this.initCamera()
        this.renderer.render(this.scene, this.camera)
    }
    initCamera() {
        const camera = new THREE.PerspectiveCamera(this.viewAngle,
            this.width/this.height, 0.1, 9999)
        camera.position.z = 3
        camera.lookAt(new THREE.Vector3(0, 0, 0))
        this.camera = camera
    }
    initThree (model) {
        const renderer = new THREE.WebGLRenderer({antialias: true})
        renderer.setClearColor(0xFFFFFF)
        const scene = new THREE.Scene()
        scene.add(model)
        const lightIntensity = 0.5 // increase if too dark
        const light = new THREE.PointLight(0xFFFFFF, lightIntensity, 100, 0)
        light.position.set(1, 1, 3)
        scene.add(light)
        const ambientLight = new THREE.AmbientLight(0x888888)
        scene.add(ambientLight)
        renderer.setSize(this.width, this.height)
        this.container.appendChild(renderer.domElement)
        renderer.domElement.onmousedown = this.draggingModeOn.bind(this)
        renderer.domElement.onmouseup = this.draggingModeOff.bind(this)
        renderer.domElement.onmousemove = this.mouseMove.bind(this)
        renderer.domElement.onmouseleave = this.draggingModeOff.bind(this)
        this.renderer = renderer
        this.scene = scene
        this.model = model
        this.render()
    }
}
