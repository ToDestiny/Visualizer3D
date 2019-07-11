import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { OBJLoader2 } from 'three/examples/jsm/loaders/OBJLoader2.js'
import { to_radians } from "./util.js"
import * as UvCanvas from "./uv_canvas.js"

export default class Renderer {
    setupCanvas(canvas, canvas_texture, color_map = null) {
        canvas.on("after:render", () => {
            canvas_texture.needsUpdate = true
        })
        canvas.on("mouse:down", (event) => {
            console.log(event)
        })
        this.renderer.domElement.addEventListener("mousedown", this.onMouseDown.bind(this))
        this.renderer.domElement.addEventListener("mouseup", this.onMouseUp.bind(this))
        this.renderer.domElement.addEventListener("mousemove", this.onMouseMove.bind(this))
        canvas.add(new UvCanvas.Rect({width: 2048, height: 2048, fill: 'grey'}))
        canvas.renderAll()
        /*if (color_map) {
            fabric.Image.fromURL(
                color_map,
                (img) => {
                    img.scaleToWidth(2048)
                    canvas.add(img)
                    canvas.renderAll()
                }
            )
        }*/
    }
    setupModel(part, part_info, index) {
        const factor = 1
        let name = part_info.name
        let canvas = new UvCanvas.Canvas("canvas_" + index, {width: 2048, height: 2048})
        let canvas_texture = new THREE.Texture(canvas.canvas_element)
        this.setupCanvas(canvas, canvas_texture)

        let material = new THREE.MeshPhongMaterial({color: 0xffffff,
            map: canvas_texture,
            /* TODO normal map */
            shininess: 15,
            side: THREE.DoubleSide})
        let mesh
        part.scale.multiplyScalar(factor)
        part.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                mesh = child
                child.name = name
                child.material = material
            }
        })
        part.position.y = -0.25
        this.parts[index] = {mesh: mesh, canvas: canvas, canvas_texture: canvas_texture}
        this.scene.add(part)
    }
    loadModel(part_info, index) {
        let obj_loader = new OBJLoader2()
        obj_loader.load(part_info.obj_file,
            (part) => this.setupModel(part, part_info, index),
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
        const raycaster = new THREE.Raycaster();

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
        this.raycaster = raycaster
        scene.add(this.light)
        scene.add(this.point_light0)
        scene.add(this.point_light1)
        this.renderLoop()
    }
    constructor(container, model_info_url) {
        this.container = container
        this.rotation_y = 0
        this.rotation_x = 0
        this.width = 800 // window.innerWidth
        this.height = 600 // window.innerHeight
        this.view_angle = 75
        this.initThree()
        // TODO ask if it's better to pass url or json
        this.model_info = require('static/t-shirt/t-shirt.json')
        this.parts = []
        this.model_info.parts.forEach(this.loadModel, this)
        this.fixed_logos = {}
    }
    getFixedPositions() {
        return this.model_info.fixed_logos
    }
    logoPositionToSpecs(position) {
        let config = (this.getFixedPositions())[position]
        let specs = {
            model: this.parts.find((part) => part.mesh.name == config.part),
            width: config.width,
            top: config.top,
            left: config.left
        }
        return specs
    }
    addFixedLogo(image_url, uuid, position) {
        if (uuid in this.fixed_logos) {
            this.fixed_logos[uuid].canvas.remove(this.fixed_logos[uuid].image)
            this.fixed_logos[uuid].model.canvas.renderAll()
        }
        let specs = this.logoPositionToSpecs(position)
        UvCanvas.ImageRect.fromURL(image_url, (image) => {
            image.scaleToWidth(specs.width)
            image.top = specs.top
            image.left = specs.left
            this.fixed_logos[uuid] = {
                image: image,
                canvas: specs.model.canvas,
                model: specs.model,
                position: position
            }
            specs.model.canvas.add(image)
            specs.model.canvas.renderAll()
        })
    }
    removeLogo(uuid) {
        /* TODO non fixed logo */
        if (uuid in this.fixed_logos) {
            this.fixed_logos[uuid].canvas.remove(this.fixed_logos[uuid].image)
            this.fixed_logos[uuid].model.canvas.renderAll()
            delete this.fixed_logos[uuid]
        }
    }
    renderLoop() {
        window.requestAnimationFrame(this.renderLoop.bind(this))
        this.renderer.render(this.scene, this.camera)
    }
    updateCollision() {
        let bounding_rect = this.renderer.domElement.getBoundingClientRect()
        let coords = {
            x: (event.offsetX / bounding_rect.width) * 2 - 1,
            y: -(event.offsetY / bounding_rect.height) * 2 + 1
        }
        this.raycaster.setFromCamera(coords, this.camera)
        let ray_test = this.raycaster.intersectObjects(this.parts.map((part) => part.mesh))

        if (ray_test.length) {
            let part = this.parts.find((part) => part.mesh === ray_test[0].object)
            // TODO error check
            let event_info = {
                canvas: part.canvas,
                clientX: ray_test[0].uv.x * bounding_rect.width + bounding_rect.left,
                clientY: ray_test[0].uv.y * bounding_rect.height + bounding_rect.top
            }
            return event_info
        }
        else
            return null
    }
    genFakeEvent(event, type, info) {
        if (info) {
            var new_event = document.createEvent("MouseEvents")
            new_event.initMouseEvent(type, false, true, window, 1, 0, 0,
                info.clientX, info.clientY, event.ctrlKey, event.altKey, event.shiftKey,
                event.metaKey, event.button, info.canvas.upperCanvasEl)
            return (new_event)
        }
        else
            return null
    }
    onMouseDown(event) {
        
        this.updateCollision(   )
    }
    onMouseUp(event) {

    }
    onMouseMove(event) {
        let info = this.updateCollision()
        let new_event = this.genFakeEvent(event, event.type, info)
        /*if (new_event != null)
            info.canvas.upperCanvasEl.dispatchEvent(new_event)*/
    }
}
