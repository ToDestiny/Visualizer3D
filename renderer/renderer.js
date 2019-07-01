import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { OBJLoader2 } from 'three/examples/jsm/loaders/OBJLoader2.js'
import { fabric } from 'fabric'

function to_radians(angle) {
    return angle * 2 * Math.PI / 360.0
}

export default class Renderer {
    renderModelCanvas(model) {
        model.canvas.renderAll()
        model.canvas_texture.needsUpdate = true
    }
    setupModel(model, name, index) {
        const factor = 1
        let canvas = new fabric.Canvas(name + '_canvas', {width: 2048, height: 2048})
        let canvas_texture = new THREE.Texture(canvas.getElement())
        canvas.add(new fabric.Rect({width: 2048, height: 2048, fill: 'grey'}))
        this.renderModelCanvas({canvas, canvas_texture})
        /*fabric.Image.fromURL(
            't-shirt2/textures/material_baseColor.jpeg',
            (img) => {
                img.scaleToWidth(2048)
                img.scaleToWidth(2048)
                canvas.add(img)
                this.renderModelCanvas({canvas, canvas_texture})
            }
        )*/
        let material = new THREE.MeshPhongMaterial({color: 0xffffff,
            map: canvas_texture,
            shininess: 1,
            side: THREE.DoubleSide})
        let mesh

        model.scale.x = factor
        model.scale.y = factor
        model.scale.z = factor
        model.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                mesh = child
                child.name = name
                child.material = material
                model.position.y = -0.25
            }
        })
        this.models[index] = {mesh: mesh, canvas: canvas, canvas_texture: canvas_texture}
        this.scene.add(model)
    }
    loadModel(model_info, index) {
        let obj_loader = new OBJLoader2()
        obj_loader.load(model_info.filename,
            (model) => this.setupModel(model, model_info.name, index),
            null,
            (err) => {console.error(err)},
            null, false
        )
    }
    initThree(model) {
        const scene = new THREE.Scene()

        const light = new THREE.AmbientLight(0x888888)
        const point_light0 = new THREE.PointLight(0xdddddd, 1, 1000, 4)
        const point_light1 = new THREE.PointLight(0xdddddd, 1, 1000, 4)
        point_light0.position.copy(new THREE.Vector3(0, 5, 5))
        point_light1.position.copy(new THREE.Vector3(0, 10, -5))
        //const raycaster = new THREE.Raycaster();

        const renderer = new THREE.WebGLRenderer({antialias: true})
        renderer.setClearColor(0xFCFCFC)
        this.container.appendChild(renderer.domElement)
        renderer.setSize(this.width, this.height)

        const camera = new THREE.PerspectiveCamera(this.view_angle,
            this.width/this.height, 0.1, 9999)
        camera.position.copy(new THREE.Vector3(0.5, 0.5, 3))
        const controls = new OrbitControls(camera, renderer.domElement)
        controls.minDistance = 1.5
        controls.maxDistance = 10
        controls.maxPolarAngle = to_radians(90 + 20)
        controls.minPolarAngle = to_radians(90 - 20)
        controls.enableKeys = false
        controls.enablePan = false
        controls.addEventListener('change', function () {
            this.moved = true
        }.bind(this))

        this.texture_loader = new THREE.TextureLoader()
        this.camera = camera
        this.renderer = renderer
        this.scene = scene
        this.light = light
        this.point_light0 = point_light0
        this.point_light1 = point_light1
        //this.raycaster = raycaster
        scene.add(this.light)
        scene.add(this.point_light0)
        scene.add(this.point_light1)
        this.renderLoop()
    }
    constructor(container) {
        this.container = container
        this.rotation_y = 0
        this.rotation_x = 0
        this.width = 800 // window.innerWidth
        this.height = 600 // window.innerHeight
        this.view_angle = 75
        this.initThree()
        console.log('Loading scene')
        this.models_info = [
            {filename: "t-shirt-uv/back.obj", name: "back"},
            {filename: "t-shirt-uv/front.obj", name: "front"},
            {filename: "t-shirt-uv/sleeve_left.obj", name: "sleeve_left"},
            {filename: "t-shirt-uv/sleeve_right.obj", name: "sleeve_right"}
        ]
        this.models = []
        this.models_info.forEach(this.loadModel, this)
        this.fixed_logos = {}
    }
    /*mouseMove (e) {
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
    }*/
    logoPositionToSpecs(position) {
        /* TODO */
        return {
            model: this.models.find((model) => model.mesh.name == "front"),
            width: 500,
            top: 450,
            left: 450
        }
    }
    addFixedLogo(position, image_url, uuid) {
        if (position in this.fixed_logos) {
            this.fixed_logos[position].canvas.remove(this.fixed_logos[position].image)
            this.renderModelCanvas(this.fixed_logos[position].model)
        }
        let specs = this.logoPositionToSpecs(position)
        fabric.Image.fromURL(image_url, (image) => {
            image.scaleToWidth(specs.width)
            image.top = specs.top
            image.left = specs.left
            this.fixed_logos[position] = {
                image: image,
                canvas: specs.model.canvas,
                model: specs.model,
                uuid: uuid,
                position: position
            }
            specs.model.canvas.add(image)
            this.renderModelCanvas(specs.model)
        })
    }
    removeLogo(uuid) {
        /* TODO non fixed logo */
        let fixed_logo = Object.values(this.fixed_logos).find((logo) => logo.uuid == uuid)
        if (fixed_logo) {
            fixed_logo.canvas.remove(fixed_logo.image)
            this.renderModelCanvas(fixed_logo.model)
            delete this.fixed_logos[fixed_logo.position]
        }
    }
    renderLoop() {
        window.requestAnimationFrame(this.renderLoop.bind(this))
        this.renderer.render(this.scene, this.camera)
    }
}
