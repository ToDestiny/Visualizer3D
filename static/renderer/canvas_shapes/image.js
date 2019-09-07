import { to_radians, multiply_matrices } from "../util.js"

export class ImageRect {
    static fromURL(url, success_callback, options, failure_callback) {
        let img_el = new Image()
        img_el.onload = function () {
            let img_object = new ImageRect(img_el, options)
            success_callback(img_object)
        }
        img_el.onerror = failure_callback
        img_el.src = url
    }
    constructor(img_el, options) {
        this.img_el = img_el
        this.subcanvas_element = document.createElement("canvas")
        this._parseOptions(options)
    }
    _parseOptions(options) {
        for (var prop in options) {
            this[prop] = options[prop]
        }
        this.width = this.width || this.img_el.width
        this.height = this.height || this.img_el.height
        this.subcanvas_element.width = this.width
        this.subcanvas_element.height = this.height
        this.angle = this.angle || 0
        this.center_y = this.center_y || 0
        this.center_x = this.center_x || 0
        this.fill = this.fill || ""
        this.color_compositing = this.color_compositing || "source-in"
    }
    _getSimpleContext() {
        let canvas = document.createElement("canvas")
        let ctx = canvas.getContext("2d")
        return { canvas, ctx }
    }
    _doDraw(ctx) {
        ctx.drawImage(this.subcanvas_element, -(this.width / 2), -(this.height / 2), this.width, this.height)
    }
    _composite() {
        let subcanvas_ctx = this.subcanvas_element.getContext("2d")
        subcanvas_ctx.globalCompositeOperation = "source-over"
        subcanvas_ctx.drawImage(this.img_el, 0, 0, this.width, this.height)
        if (this.fill) {
            subcanvas_ctx.fillStyle = this.fill
            subcanvas_ctx.globalCompositeOperation = this.color_compositing
            subcanvas_ctx.fillRect(0, 0, this.width, this.height)
        }
    }
    _render(ctx) {
        this._composite()
        ctx.save()
        let transform = this.calcTransformMatrix()
        ctx.transform(transform[0], transform[3], transform[1], transform[4], transform[2], transform[5])
        this._doDraw(ctx)
        ctx.restore()
    }
    getCenterPoint() {
        return {
            x: this.center_x,
            y: this.center_y
        }
    }
    calcTranslationMatrix() {
        let center = this.getCenterPoint()
        return [
            1, 0, center.x,
            0, 1, center.y,
            0, 0, 1
        ]
    }
    calcRotationMatrix () {
        let radians = to_radians(this.angle)
        return [
            Math.cos(radians), -Math.sin(radians), 0,
            Math.sin(radians), Math.cos(radians), 0,
            0, 0, 1
        ]
    }
    calcTransformMatrix() {
        let translate = this.calcTranslationMatrix()
        let rotation = this.calcRotationMatrix()
        return multiply_matrices(translate, rotation)
    }
    scale(factor) {
        this.width *= factor
        this.height *= factor
        this.subcanvas_element.width = this.width
        this.subcanvas_element.height = this.height
    }

    scaleToWidth(new_width) {
        if (this.width === 0 && new_width != 0)
            throw "Width is 0, no constant is going scale it up to argument"
        this.scale(new_width / this.width)
    }
    scaleToHeight(new_height) {
        if (this.height === 0 && new_height != 0)
            throw "height is 0, no constant is going scale it up to argument"
        this.scale(new_height / this.height)
    }
    getBase64() {
        let simple = this._getSimpleContext()
        simple.canvas.width = this.width
        simple.canvas.height = this.height
        simple.ctx.drawImage(this.img_el, 0, 0, this.width, this.height)
        return simple.canvas.toDataURL()
    }
}