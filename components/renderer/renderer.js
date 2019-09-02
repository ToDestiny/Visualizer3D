import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { OBJLoader2 } from 'three/examples/jsm/loaders/OBJLoader2.js'
import { to_radians } from "./util.js"
import * as UvCanvas from "./uv_canvas.js"
import { TextRect } from './canvas_shapes/text.js';

function format(str, obj) {
    return str.replace(/\{\s*([^}\s]+)\s*\}/g, function(m, p1, offset, string) {
        return obj[p1]
    })
}

export default class Renderer {
    static getPositions(model_info) {
        // TODO add custom config
        return model_info.logos
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
    constructor(container) {
        this.container = container
        this.rotation_y = 0
        this.rotation_x = 0
        this.width = 1000 // window.innerWidth
        this.height = 800 // window.innerHeight
        this.view_angle = 75
        this.initThree()
        var bebas_font = new FontFace("Bebas Neue", "url('" + "/fonts/BebasNeue-Regular.woff2" + "')")
        bebas_font.load()
        .then(() => {
            document.fonts.add(bebas_font)
        })
        .catch((e) => console.error(e.message))
    }
    setupCanvas(canvas, canvas_texture, color_map = null) {
        canvas.on("after:render", () => {
            canvas_texture.needsUpdate = true
        })
        canvas.on("mouse:down", (event) => {
            console.log(event)
        })
    }
    setupPart(part, part_info, index) {
        const factor = 0.04
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
        part.position.add(new THREE.Vector3(0, -0.8, 0))
        part.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                mesh = child
                child.name = name
                child.material = material
                child.position.add(new THREE.Vector3(0, -5, 0))
            }
        })
        //part.position.y = -0.25
        this.parts[index] = {
            obj: part,
            mesh: mesh,
            canvas: canvas,
            canvas_texture: canvas_texture,
            template_objs: []
        }
        this.scene.add(part)
    }
    loadPart(part_info, index, resolve, reject) {
        let obj_loader = new OBJLoader2()
        obj_loader.load(part_info.obj_file,
            (part) => {
                this.setupPart(part, part_info, index)
                resolve(part)
            },
            null,
            (err) => {
                console.error(err)
                reject(err)
            },
            null, true)
    }
    setupTemplateSpec(templ) {
        let color_mask_spec = templ.color_masks
        templ.color_masks = {}
        this.model_info.parts.forEach((part) => {
            let part_masks = templ.colors_default.map(
                (color, color_idx) => format(color_mask_spec, [color_idx, part.name]))
            templ.color_masks[part.name] = part_masks
        })
    }
    setupFixedLogos() {
        this.model_info.fixed_logos.forEach((logo) => {
            let model = this.parts.find((part) => part.mesh.name == logo.part)
            return new Promise((resolve, reject) => {
                UvCanvas.ImageRect.fromURL(logo.url, (image) => {
                    if (image) {
                        image.scaleToWidth(logo.width)
                        image.center_y = logo.center_y
                        image.center_x = logo.center_x
                        model.canvas.add(image, 2)
                        model.canvas.renderAll()
                        resolve(image)
                    }
                    else
                        reject("Error loading logo")
                }, {}, () => reject("Error loading logo"))
            })
        })
    }
    setModel(model_info) {
        this.resetModel()
        this.model_info = model_info
        this.model_info.templates.forEach(this.setupTemplateSpec.bind(this))
        this.parts = []
        this.text_slots = {}
        this.logos = {}
        let load_parts_jobs = Promise.all(this.model_info.parts.map((part, index) => {
            return new Promise((resolve, reject) => this.loadPart(part, index, resolve, reject))
        }))
        return load_parts_jobs.then(() => {
            Object.keys(this.model_info.text_slots).forEach((key) => {
                this.setText("", key)
            })
        }).then(this.setupFixedLogos.bind(this))
        .then(() => this.setTemplate(0))
    }
    resetModel() {
        if (this.parts) {
            this.parts.forEach((part) => {
                this.scene.remove(part.obj)
                // TODO does the canvas stuff need to be freed?
            })
            this.parts = []
        }
    }
    _clearTemplateCanvas(part_index, color_index, update=true) {
        if (color_index == undefined)
            this.parts[part_index].template_objs.forEach((obj) => {
                this.parts[part_index].canvas.remove(obj)
            })
        else
            this.parts[part_index].canvas.remove(this.parts[part_index].template_objs[color_index])
        if (update)
            this.parts[name].canvas.renderAll()
    }
    _addTemplateImg(img, part_index, color_index) {
        this.parts[part_index].template_objs[color_index] = img
        this.parts[part_index].canvas.add(img, 0)
    }
    _makeBackgroundOptions(color_index) {
        return {
            fill: this.template_colors[color_index],
            center_x: 1024,
            center_y: 1024,
            width: 2048,
            height: 2048
        }
    }
    _makeTemplateLoadPromise(color_mask_url, part_index, color_index) {
        return new Promise((resolve, reject) => {
            UvCanvas.ImageRect.fromURL(color_mask_url,
                (img) => {
                    if (img) {
                        this._addTemplateImg(img, part_index, color_index, resolve)
                        resolve(img)
                    }
                    else
                        reject("Error loading template")
                },
                this._makeBackgroundOptions(color_index),
                () => reject("Error loading template"))
        })
    }
    _updateTemplatePart(part_index, color_index) {
        if (this.parts[part_index].template_objs)
            this._clearTemplateCanvas(part_index, color_index, false)
        let selected = this.model_info.templates[this.template_index]
        let name = this.parts[part_index].mesh.name
        if (color_index == undefined)
            return selected.color_masks[name].map(
                (color_mask_url, index) => this._makeTemplateLoadPromise(color_mask_url, part_index, index))
        else
            return [this._makeTemplateLoadPromise(selected.color_masks[name][color_index], part_index, color_index)]
    }
    _updateTemplate(color_index) {
        let promises = []
        this.parts.forEach((part, part_index) => {
            promises.push(...this._updateTemplatePart(part_index, color_index))
        })
        return Promise.all(promises).then(() => {
            this.parts.forEach((part) => part.canvas.renderAll())
        }).catch((err) => console.error(err.message))
    }
    async setTemplate(index) {
        // TODO make sure it works
        // TODO this is now async, maybe need to update store function
        console.warn("setTemplate stub called")
        this.template_index = index
        let template = this.model_info.templates[this.template_index]
        this.template_colors = [...template.colors_default]
        await this._updateTemplate()
        return this.template_colors
    }
    async setTemplateColor(color_index, color) {
        // TODO color index or description?
        // TODO raise if no template is initialized
        console.warn("setTemplateColor stub called")
        this.template_colors = [...this.template_colors]
        this.template_colors[color_index] = color
        await this._updateTemplate(color_index)
        return this.template_colors
    }
    setLogo({ data, uuid, position }, resolve) {
        if (uuid in this.logos) {
            this.logos[uuid].canvas.remove(this.logos[uuid].image)
            this.logos[uuid].model.canvas.renderAll()
        }
        let specs = this.logoPositionToSpecs(position)
        return new Promise((resolve, reject) => {
            UvCanvas.ImageRect.fromURL(data, (image) => {
                if (image) {
                    image.scaleToWidth(specs.width)
                    image.center_y = specs.center_y
                    image.center_x = specs.center_x
                    this.logos[uuid] = {
                        image: image,
                        canvas: specs.model.canvas,
                        model: specs.model,
                        position: position
                    }
                    specs.model.canvas.add(image, 1)
                    specs.model.canvas.renderAll()
                    resolve(image)
                }
                else
                    reject("Error loading logo")
            }, {}, () => reject("Error loading logo"))
        })
    }
    removeLogo(uuid) {
        if (uuid in this.logos) {
            this.logos[uuid].canvas.remove(this.logos[uuid].image)
            this.logos[uuid].model.canvas.renderAll()
            delete this.logos[uuid]
        }
    }
    setText(text, slot) {
        if (this.text_slots[slot]) {
            this.text_slots[slot].canvas.remove(this.text_slots[slot].text_rect)
            this.text_slots[slot].canvas.renderAll()
            delete this.text_slots[slot]
        }
        if (text) {
            let specs = this.textSlotToSpecs(slot)
            let text_rect = new TextRect(text, {
                font_size: specs.font_size,
                font_family: "Bebas Neue",
                fill: "white",
                center_y: specs.center_y,
                center_x: specs.center_x
            })
            this.text_slots[slot] = {
                text_rect: text_rect,
                model: specs.model,
                canvas: specs.model.canvas
            }
            specs.model.canvas.add(text_rect, 1)
            specs.model.canvas.renderAll()
        }
    }
    textSlotToSpecs(slot) {
        let config = this.model_info.text_slots[slot]
        let specs = {
            name: config.name,
            model: this.parts.find((part) => part.mesh.name == config.part),
            font_size: config.font_size,
            center_x: config.center_x,
            center_y: config.center_y
        }
        return specs
    }
    logoPositionToSpecs(position) {
        let config = (Renderer.getPositions(this.model_info))[position]
        let specs = {
            model: this.parts.find((part) => part.mesh.name == config.part),
            width: config.width,
            center_y: config.center_y,
            center_x: config.center_x
        }
        return specs
    }
    renderLoop() {
        window.requestAnimationFrame(this.renderLoop.bind(this))
        this.renderer.render(this.scene, this.camera)
    }
    // TODO rewrite everything under this
    // ---------------------------------------------------------------------------------- //
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
