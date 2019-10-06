import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { OBJLoader2 } from 'three/examples/jsm/loaders/OBJLoader2.js'
import * as NODES from 'three/examples/jsm/nodes/Nodes.js'
import { to_radians } from "./util.js"
import * as UvCanvas from "./uv_canvas.js"
import { TextRect } from './canvas_shapes/text.js';
import Observable from './observable.js'

function format(str, obj) {
    return str.replace(/\{\s*([^}\s]+)\s*\}/g, function(m, p1, offset, string) {
        return obj[p1]
    })
}

export default class Renderer extends Observable {
    static getPositions(model_info) {
        // TODO add custom config
        return model_info.logos
    }
    static async fetchConfig(model_url) {
        let model = await fetch(model_url).then(r => r.json())
        let model_path = model_url.substring(0, model_url.lastIndexOf("/") + 1)
        model["url"] = model_url
        model.parts.forEach((part) => {
            part.obj_file = model_path + part.obj_file
            part.normal_map = part.normal_map ? model_path + part.normal_map : undefined
        })
        model.templates.forEach((templ) => {
            templ.thumb_url = model_path + templ.thumb_url
            templ.color_masks = model_path + templ.color_masks
        })
        return model
    }
    initThree(model) {
        const scene = new THREE.Scene()

        const light = new THREE.AmbientLight(0x888888)
        const point_light0 = new THREE.PointLight(0xdddddd, 1, 1000, 4)
        const point_light1 = new THREE.PointLight(0xdddddd, 1, 1000, 4)
        point_light0.position.copy(new THREE.Vector3(0, 5, 5))
        point_light1.position.copy(new THREE.Vector3(0, 10, -5))
        const raycaster = new THREE.Raycaster();

        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            preserveDrawingBuffer: true
        })
        renderer.setClearColor(0xFCFCFC)
        this.container.appendChild(renderer.domElement)
        renderer.setSize(this.width, this.height)
        renderer.setClearColor(0xffffff, 1)

        const camera = new THREE.PerspectiveCamera(this.view_angle,
            this.width/this.height, 0.1, 9999)
        camera.position.copy(new THREE.Vector3(0.5, 0.5, 3))
        const controls = new OrbitControls(camera, renderer.domElement)
        controls.minDistance = 1.5
        controls.maxDistance = 2.5
        controls.maxPolarAngle = to_radians(90 + 20)
        controls.minPolarAngle = to_radians(90 - 20)
        controls.enableKeys = false
        controls.enablePan = false
        controls.addEventListener('change', function () {
            this.moved = true
        }.bind(this))
        controls.update()

        this.texture_loader = new THREE.TextureLoader()
        this.camera = camera
        this.controls = controls
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
        super()
        this.container = container
        this.rotation_y = 0
        this.rotation_x = 0
        this.width = 600 // window.innerWidth
        this.height = 600 // window.innerHeight
        this.view_angle = 65
        this.initThree()
        var bebas_font = new FontFace("Bebas Neue", "url('" + "/fonts/BebasNeue-Regular.woff2" + "')")
        bebas_font.load() // TODO wait for it to finish??
        .then(() => {
            document.fonts.add(bebas_font)
        })
        .catch((e) => console.error(e.message))
    }
    setupCanvas(canvas, canvas_texture, color_map) {
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
        this.setupCanvas(canvas, canvas_texture, part_info.color_map)
        // set up node material
        let material = new NODES.StandardNodeMaterial()
        material.color = new NODES.TextureNode(canvas_texture)
        material.roughness = new NODES.FloatNode(1)
        material.metalness = new NODES.FloatNode(0)
        if (part_info.normal_map) {
            let intensity = 1
            let normal_texture = new THREE.TextureLoader().load(part_info.normal_map)
            normal_texture.wrapS = normal_texture.wrapT = THREE.RepeatWrapping
            let normal_uv = new NODES.UVNode()
            normal_uv = new NODES.OperatorNode(
                normal_uv,
                new NODES.FloatNode(part_info.normal_scale),
                NODES.OperatorNode.MUL
            )
            material.normal = new NODES.NormalMapNode(
                new NODES.TextureNode(normal_texture, normal_uv), 
                new NODES.Vector2Node(intensity, intensity))
        }
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
        return Promise.all(this.model_info.fixed_logos.map((logo) => {
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
        }))
    }
    async setModel(model_info) {
        this.resetModel()
        this.model_info = model_info
        this.model_info.templates.forEach(this.setupTemplateSpec.bind(this))
        await Promise.all(this.model_info.parts.map((part, index) => {
            return new Promise((resolve, reject) => this.loadPart(part, index, resolve, reject))
        }))
        await this.setupFixedLogos()
        Object.keys(this.model_info.text_slots).forEach((key) => this.setText({
            text: "",
            color: null
        }, key))
        let colors = await this.setTemplate(0)
        return {
            text_slots: this.getTextSlots(),
            template_index: 0,
            colors
        }
    }
    resetModel() {
        if (this.parts) {
            this.parts.forEach((part) => {
                this.scene.remove(part.obj)
                // TODO does the canvas stuff need to be freed?
            })
        }
        this.parts = []
        this.text_slots = {}
        this.logos = {}
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
        // TODO use Vue.set() instead of recreating array
        this.template_index = index
        let template = this.model_info.templates[this.template_index]
        this.template_colors = [...template.colors_default]
        await this._updateTemplate()
        return this.getTemplateColors()
    }
    async setTemplateColor(color_index, color) {
        // TODO color index or description?
        // TODO raise if no template is initialized
        this.template_colors = [...this.template_colors]
        this.template_colors[color_index] = color
        await this._updateTemplate(color_index)
        return this.getTemplateColors()
    }
    getTemplateColors() {
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
                        position: position,
                        data: data
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
    setText({ text, color }, slot) {
        if (!color)
            color = "#ffffff"
        if (this.text_slots[slot]) {
            this.text_slots[slot].canvas.remove(this.text_slots[slot].text_rect)
            this.text_slots[slot].canvas.renderAll()
            delete this.text_slots[slot]
        }
        let specs = this.textSlotToSpecs(slot)
        let text_rect = new TextRect(text, {
            font_size: specs.font_size,
            font_family: "Bebas Neue",
            fill: color,
            center_y: specs.center_y,
            center_x: specs.center_x
        })
        this.text_slots[slot] = {
            text,
            color,
            text_rect: text_rect,
            model: specs.model,
            canvas: specs.model.canvas
        }
        specs.model.canvas.add(text_rect, 1)
        specs.model.canvas.renderAll()
        return this.text_slots[slot]
    }
    getTextSlots() {
        return Object.keys(this.text_slots).reduce((map, curr) => {
            map[curr] = {
                text: this.text_slots[curr].text,
                color: this.text_slots[curr].color
            }
            return map
        }, {})
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
    getConfig() {
        return {
            model_name: this.model_info.name,
            url: this.model_info.url,
            version: this.model_info.version,
            logos: Object.keys(this.logos).map((uuid) => ({
                uuid,
                data: this.logos[uuid].image.getBase64(),
                position: this.logos[uuid].position,
            })),
            text: Object.keys(this.text_slots).map((key) => ({
                text: this.text_slots[key].text,
                color: this.text_slots[key].color,
                slot: key
            })),
            template_index: this.template_index,
            template_colors: this.template_colors
        }
    }
    async loadConfig(config) {
        if (config.version != this.model_info.version)
            throw "Loading a config with a different version is not supported. TODO (?)"
        if (config.model_name != this.model_name)
        {
            let model_info = await Renderer.fetchConfig(config.url)
            await this.setModel(model_info)
        }
        await Promise.all(config.logos.map((logo) => this.setLogo(logo)))
        config.text.forEach((text) => this.setText({
            text: text.text,
            color: text.color
        }, text.slot))
        await this.setTemplate(config.template_index)
        await Promise.all(config.template_colors.map((color, index) => this.setTemplateColor(index, color)))
        return {
            template_index: this.template_index,
            colors: this.getTemplateColors(),
            text_slots: this.getTextSlots(),
            logos: Object.keys(this.logos).map((uuid) => ({
                uuid,
                position: this.logos[uuid].position,
                data: this.logos[uuid].data
            }))
        }
    }
    resetCamera() {
        this.controls.reset()
    }
    renderLoop() {
        this.fire("before:render")
        window.requestAnimationFrame(this.renderLoop.bind(this))
        this.renderer.render(this.scene, this.camera)
        this.fire("after:render")
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
