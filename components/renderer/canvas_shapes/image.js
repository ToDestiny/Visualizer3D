import { to_radians, multiply_matrices } from "../util.js"

export class ImageRect {
    static fromURL(url, callback, options) {
        let img_el = new Image()
        img_el.onload = function () {
            let img_object = new ImageRect(img_el, options)
            callback(img_object)
        }
        img_el.src = url
    }
    constructor(img_el, options) {
        this.img_el = img_el
        this._parseOptions(options)
    }
    _parseOptions(options) {
        for (var prop in options) {
            this[prop] = options[prop]
        }
        this.width = this.width || this.img_el.width
        this.height = this.height || this.img_el.height
        this.angle = this.angle || 0
        this.center_y = this.center_y || 0
        this.center_x = this.center_x || 0
        this.fill = this.fill || "black"
    }
    _doDraw(ctx) {
        ctx.drawImage(this.img_el, -(this.width / 2), -(this.height / 2), this.width, this.height)
    }
    _render(ctx) {
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
    }

    scaleToWidth(new_width) {
        if (this.width === 0 && new_width != 0)
            throw "Width is 0, no constant is going scale it up to argument"
        this.height = this.height * new_width / this.width
        this.width = new_width
    }
    scaleToHeight(new_height) {
        if (this.height === 0 && new_height != 0)
            throw "height is 0, no constant is going scale it up to argument"
        this.width = this.width * new_height / this.height
        this.height = new_height
    }
}