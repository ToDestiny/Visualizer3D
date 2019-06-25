import * as THREE from 'three'
import { DecalGeometry } from 'three/examples/jsm/geometries/DecalGeometry.js'
import GLTFLoader from 'three-gltf-loader'

export default class Renderer {
    constructor(container) {
        this.container = container
        this.rotation_y = 0
        this.rotation_x = 0
        this.width = 600 // window.innerWidth
        this.height = 400 // window.innerHeight
        this.view_angle = 75
        this.is_dragging = false
        this.mouse_mode = "dragging"
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
        if (this.mouse_mode === "dragging")
            this.is_dragging = true
    }
    mouseUp () {
        if (this.mouse_mode === "dragging")
            this.is_dragging = false
        else if (this.mouse_mode === "shooting")
            this.shoot()
    }
    mouseLeave () {
        if (this.mouse_mode === "dragging")
            this.is_dragging = false
    }
    toggleMouseMode() {
        if (this.mouse_mode === "dragging")
        {
            this.mouse_mode = "shooting"
            this.is_dragging = false
        }
        else if (this.mouse_mode === "shooting")
            this.mouse_mode = "dragging"
    }
    mouseMove (e) {
        function toRadians(angle) {
            return angle * (Math.PI / 180.0);
        }
        var deltaMove = {x: 0.0, y: 0.0}
        if (this.mouse_position)
        {
            deltaMove =  {
                x: e.offsetX - this.mouse_position.x,
                y: e.offsetY - this.mouse_position.y
            }
        }
        this.mouse_position = {
            x: e.offsetX,
            y: e.offsetY,
        }
        if (this.is_dragging) {
            // TODO switch to orbit controls
            this.rotation_x += deltaMove.y * 0.01
            this.rotation_y += deltaMove.x * 0.01
            var vert_limit = toRadians(25)
            if (this.rotation_x > vert_limit)
                this.rotation_x = vert_limit
            else if (this.rotation_x < -vert_limit)
                this.rotation_x = -vert_limit
            this.model.setRotationFromEuler(new THREE.Euler(
                this.rotation_x,
                this.rotation_y,
                0,
                'XYZ'))
            this.decals.forEach((d) => d.setRotationFromEuler(new THREE.Euler(
                this.rotation_x,
                this.rotation_y,
                0,
                'XYZ')))
            this.renderer.render(this.scene, this.camera)
        }
        this.mouse_coords = {
            x: (this.mouse_position.x / this.renderer.domElement.width) * 2 - 1,
            y: - (this.mouse_position.y / this.renderer.domElement.height) * 2 + 1
        }
        this.getImpact()
        // console.log(this.mouse_coords)
    }
    zoomIn(val) {
        if (val > 0)
        {
            this.distance -= val
            if (this.distance < 1.3)
                this.distance = 1.3
            this.render()
        }
    }
    zoomOut(val) {
        if (val > 0)
        {
            this.distance += val
            if (this.distance > 3.5)
                this.distance = 3.5
            this.render()
        }
    }
    getImpact() {
        this.raycaster.setFromCamera(this.mouse_coords, this.camera)
        var raycast = this.raycaster.intersectObjects([this.model], true)
        if (raycast) {
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
        this.render()
    }
    shoot() {
        if (this.intersection.intersects) {
            const placeholder_size = new THREE.Vector3(0.5, 0.5, 1)
            var orientation = (new THREE.Euler()).copy(this.mouse_helper.rotation)
            var point = (new THREE.Vector3()).copy(this.intersection.point)

            var decal_geom = new DecalGeometry(this.intersection.object,
                point, orientation, placeholder_size)
            var decal = new THREE.Mesh(decal_geom, new THREE.MeshBasicMaterial({
                color: 0x00ff00,
                transparent: true,
                depthTest: true,
                depthWrite: false,
                polygonOffset: true,
                polygonOffsetFactor: - 4
            }))
            this.decals.push(decal)
            this.scene.add(decal)
            this.render()
        }
    }
    initCamera() {
        const camera = new THREE.PerspectiveCamera(this.view_angle,
            this.width/this.height, 0.1, 9999)
        camera.position.z = this.distance
        camera.lookAt(new THREE.Vector3(0, 0, 0))
        this.camera = camera
    }
    render() {
        this.initCamera()
        this.renderer.render(this.scene, this.camera)
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
        renderer.domElement.onmousedown = this.mouseDown.bind(this)
        renderer.domElement.onmouseup = this.mouseUp.bind(this)
        renderer.domElement.onmousemove = this.mouseMove.bind(this)
        renderer.domElement.onmouseleave = this.mouseLeave.bind(this)
        renderer.setSize(this.width, this.height)

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
        this.render()
    }
}
