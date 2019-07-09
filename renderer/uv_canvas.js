import Rect from "./canvas_shapes/rect.js"

export default class UvCanvas {
    constructor(name, options) {
        this.canvas_element = document.getElementById(name)
        if (!this.canvas_element) {
            this.canvas_element = document.createElement("canvas")
            this.canvas_element.setAttribute("id", name)
        }
        this.parseOptions(options)
        this.context = this.canvas_element.getContext("2d")
        this._objects = []
        this._event_listeners = {}
    }
    parseOptions(options) {
        for (var prop in options) {
            this[prop] = options[prop]
        }
        this.width = this.width || 400
        this.height = this.height || 400
        this.canvas_element.width = this.width
        this.canvas_element.height = this.height
    }
    add(obj) {
        this._objects.push(obj)
    }
    remove(obj) {
        let i = this._objects.findIndex((candidate) => obj === candidate)
        delete this._objects[i]
    }
    renderAll() {
        this.fire("before:render")
        this._objects.forEach((obj) => {
            obj.render(this.context)
        })
        this.fire("after:render")
    }
    fire(event_name, options) {
        if (this._event_listeners[event_name]) {
           this._event_listeners[event_name].forEach((handler) => {
                handler(this, event_name, options || {})
            })
        }
    }
    on(event_name, handler) {
        if (!this._event_listeners[event_name])
            this._event_listeners[event_name] = []
        this._event_listeners[event_name].push(handler)
    }
    off(event_name, handler) {
        let event_listener = this._event_listeners[event]
        delete event_listener[event_listener.indexOf(handler)]
    }
}

export { Rect }