import Observable from './uv_canvas_obs.js'

class Canvas extends Observable {
    constructor(name, options) {
        super()
        this.canvas_element = document.getElementById(name)
        if (!this.canvas_element) {
            this.canvas_element = document.createElement("canvas")
            this.canvas_element.setAttribute("id", name)
        }
        this._parseOptions(options)
        this.context = this.canvas_element.getContext("2d")
        this._objects = {}
        this.pointer = {
            x: 0,
            y: 0
        }
        this._initListeners()
    }
    _getPointer(evt) {
        return {
            x: evt.offsetX,
            y: evt.offsetY
        }
    }
    _handleMouseDown(evt) {
        this.fire("mouse:down:before")
        //this._getPointer
        /*let selection = this._objects.find((obj) => {
            if (obj.interactive) {
                if (obj) 
            }
        })*/
    }
    _onMouseDown(evt) {
        this._handleMouseDown(evt)
        this.canvas_element.removeEventListener("mouseup", this._onMouseUp)
        this.canvas_element.removeEventListener("mousemove", this._onMouseMove)
        document.addEventListener("mouseup", this._onMouseUp)
        document.addEventListener("mousemove", this._onMouseMove)
    }
    _onMouseMove(evt) {
        this._handleMouseMove(evt)
    }
    _onMouseUp(evt) {
        this._handleMouseUp(evt)
        document.removeEventListener("mouseup", this._onMouseUp)
        document.removeEventListener("mousemove", this._onMouseMove)
        this.canvas_element.addEventListener("mouseup", this._onMouseUp)
        this.canvas_element.addEventListener("mousemove", this._onMouseMove)
    }
    _initListeners() {
        this.canvas_element.addEventListener("mousedown", this._onMouseDown)
        this.canvas_element.addEventListener("mouseup", this._onMouseUp)
        this.canvas_element.addEventListener("mousemove", this._onMouseMove)
    }
    _parseOptions(options) {
        for (var prop in options) {
            this[prop] = options[prop]
        }
        this.width = this.width || 400
        this.height = this.height || 400
        this.canvas_element.width = this.width
        this.canvas_element.height = this.height
    }
    add(obj, priority=0) {
        if (!(priority in this._objects))
            this._objects[priority] = []
        this._objects[priority].push(obj)
    }
    remove(obj) {
        Object.keys(this._objects).forEach((p) => {
            let obj_i = this._objects[p].findIndex((candidate) => obj === candidate)
            if (obj_i >= 0)
                delete this._objects[p][obj_i]
            if (!this._objects[p])
                delete this._objects[p]
        })
    }
    renderAll() {
        this.fire("before:render")
        let priority_levels = Object.keys(this._objects)
        priority_levels.sort()
        priority_levels.forEach((p) => {
            this._objects[p].forEach((obj) => obj._render(this.context))
        })
        this.fire("after:render")
    }
}

export { Canvas }
export { Rect } from "./canvas_shapes/rect.js"
export { ImageRect } from "./canvas_shapes/image.js"
export { TextRect } from "./canvas_shapes/text.js"