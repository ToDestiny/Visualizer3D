import { to_radians, multiply_matrices } from "../util.js"

export class Rect {
    constructor(options) {
        this._parseOptions(options)
    }
    _parseOptions(options) {
        for (var prop in options) {
            this[prop] = options[prop]
        }
        this.width = this.width || 400
        this.height = this.height || 400
        this.angle = this.angle || 0
        this.top = this.top || 0
        this.left = this.left || 0
        this.fill = this.fill || "black"
    }
    _doDraw(ctx) {
        ctx.fillStyle = this.fill
        ctx.fillRect(-(this.width / 2), -(this.height / 2), this.width, this.height)
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
            x: this.left + (this.width / 2),
            y: this.top + (this.height / 2)
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
}