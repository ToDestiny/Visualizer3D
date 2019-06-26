import * as THREE from 'three'
import { DecalGeometry } from 'three/examples/jsm/geometries/DecalGeometry.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GLTFLoader from 'three-gltf-loader'

function to_radians(angle) {
    return angle * 2 * Math.PI / 360.0
}

export default class Renderer {
    constructor(container) {
        this.container = container
        this.rotation_y = 0
        this.rotation_x = 0
        this.width = 800 // window.innerWidth
        this.height = 600 // window.innerHeight
        this.view_angle = 75
        this.moved = false
        this.intersection = {
            intersects: false,
            object: null,
            point: new THREE.Vector3(),
            normal: new THREE.Vector3(),
        }
        this.mouse_helper = new THREE.Mesh(new THREE.BoxBufferGeometry(0.05, 0.05, 0.8),
            new THREE.MeshBasicMaterial({color: 0xff0000}))
        this.mouse_helper.visible = true
        this.decals = []
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
    mouseDown () {
        this.moved = false
    }
    mouseUp () {
        if (!this.moved)
            this.shoot()
    }
    mouseLeave () {
    }
    mouseMove (e) {
        this.mouse_position = {
            x: e.offsetX,
            y: e.offsetY,
        }
        this.mouse_coords = {
            x: (this.mouse_position.x / this.renderer.domElement.width) * 2 - 1,
            y: - (this.mouse_position.y / this.renderer.domElement.height) * 2 + 1
        }
        this.getImpact()
        // console.log(this.mouse_coords)
    }
    getImpact() {
        this.raycaster.setFromCamera(this.mouse_coords, this.camera)
        var raycast = this.raycaster.intersectObjects([this.model], true)
        if (raycast && raycast.length) {
            this.intersection.intersects = true
            this.intersection.object = raycast[0].object
            this.intersection.point.copy(raycast[0].point)
            var normal = raycast[0].face.normal.clone()
            normal.transformDirection(this.intersection.object.matrixWorld)
            normal.multiplyScalar(10)
            normal.add(this.intersection.point)
            this.intersection.normal = normal
            this.mouse_helper.position.copy(this.intersection.point)
            this.mouse_helper.lookAt(this.intersection.normal)
        }
        else
            this.intersection.intersects = false
    }
    shoot() {
        if (this.intersection.intersects) {
            const placeholder_size = new THREE.Vector3(0.5, 0.5, 1)
            var orientation = (new THREE.Euler()).copy(this.mouse_helper.rotation)
            var point = (new THREE.Vector3()).copy(this.intersection.point)

            var decal_geom = new DecalGeometry(this.intersection.object,
                point, orientation, placeholder_size)
            var decal = new THREE.Mesh(decal_geom, new THREE.MeshBasicMaterial({
                map: this.texture_loader.load('/t-shirt_workshop/textures/hanger_maple_baseColor.jpeg'),
                transparent: true,
                depthTest: true,
                depthWrite: false,
                polygonOffset: true,
                polygonOffsetFactor: - 4
            }))
            this.decals.push(decal)
            this.scene.add(decal)
        }
    }
    initThree(model) {
        const scene = new THREE.Scene()

        /*const lightIntensity = 0.5 // increase if too dark
        const light = new THREE.PointLight(0xFFFFFF, lightIntensity, 100, 0)
        light.position.set(1, 1, 3)*/
        const light = new THREE.AmbientLight(0xdddddd)

        const raycaster = new THREE.Raycaster();

        const renderer = new THREE.WebGLRenderer({antialias: true})
        renderer.setClearColor(0xFFFFFF)
        this.container.appendChild(renderer.domElement)
        renderer.setSize(this.width, this.height)

        const camera = new THREE.PerspectiveCamera(this.view_angle,
            this.width/this.height, 0.1, 9999)
        camera.position.copy(new THREE.Vector3(0.5, 0.5, 3))
        const controls = new OrbitControls(camera, renderer.domElement)
        controls.minDistance = 1.5
        controls.maxDistance = 10
        controls.maxPolarAngle = to_radians(90 + 40)
        controls.minPolarAngle = to_radians(90 - 40)
        controls.enableKeys = false
        controls.enablePan = false

        controls.addEventListener('change', function () {
            this.moved = true
        }.bind(this))
        renderer.domElement.addEventListener('mousedown', this.mouseDown.bind(this))
        renderer.domElement.addEventListener('mouseup', this.mouseUp.bind(this))
        renderer.domElement.addEventListener('mousemove', this.mouseMove.bind(this))
        renderer.domElement.addEventListener('mouseleave', this.mouseLeave.bind(this))

        this.texture_loader = new THREE.TextureLoader()
        this.camera = camera
        this.renderer = renderer
        this.scene = scene
        this.model = model
        this.light = light
        this.raycaster = raycaster
        this.distance = 3
        scene.add(this.model)
        scene.add(this.light)
        scene.add(this.mouse_helper)
        /*var geometry =  new THREE.DecalGeometry(this.model, , orientation, size );
        var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        var mesh = new THREE.Mesh( geometry, material );
        scene.add(geometry*/
        this.renderLoop()
    }
    renderLoop() {
        window.requestAnimationFrame(this.renderLoop.bind(this))
        this.renderer.render(this.scene, this.camera)
    }
}
