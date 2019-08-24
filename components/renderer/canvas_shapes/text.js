import { to_radians, multiply_matrices } from "../util.js"

export class TextRect {
    constructor(text, options) {
        this.text = text || ""
        this._parseOptions(options)
    }
    _parseOptions(options) {
        for (var prop in options) {
            this[prop] = options[prop]
        }
        this.font_size = this.font_size || 10
        this.font_family = this.font_family || "Arial"
        this.font_style = this.font_style || ""
        this.font_weight = this.font_weight || ""
        this.angle = this.angle || 0
        this.center_x = this.center_x || 0
        this.center_y = this.center_y || 0
        this.fill = this.fill || "black"
    }
    _prepareContext(ctx) {
        ctx.font = [
            this.font_style,
            this.font_weight,
            this.font_size + "px",
            this.font_family
        ].join(' ')
        ctx.textBaseline = "middle"
    }
    _getSimpleContext() {
        let canvas = document.createElement("canvas")
        let ctx = canvas.getContext("2d")
        return { canvas, ctx }
    }
    _getMeasuringContext() {
        let ctx = this._getSimpleContext().ctx
        this._prepareContext(ctx)
        return ctx
    }
    _doDraw(ctx) {
        let size = this.measureText(ctx)
        ctx.fillText(this.text, -(size.width / 2), 0/*-(size.height / 2)*/)
    }
    _render(ctx) {
        ctx.save()
        this._prepareContext(ctx)
        let transform = this.calcTransformMatrix(ctx)
        ctx.transform(transform[0], transform[3], transform[1], transform[4], transform[2], transform[5])
        this._doDraw(ctx)
        ctx.restore()
    }
    measureText(ctx) {
        if (!ctx)
            ctx = this._getMeasuringContext()
        let text_info = ctx.measureText(this.text)
        return {
            width: text_info.width,
            height: this.font_size
        }
    }
    getCenterPoint(ctx) {
        /*var size = this.measureText(ctx)
        return {
            x: this.left + (size.width / 2),
            y: this.top + (size.height / 2)
        }*/
        return {
            x: this.center_x,
            y: this.center_y
        }
    }
    calcTranslationMatrix(ctx) {
        let center = this.getCenterPoint(ctx)
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
    calcTransformMatrix(ctx) {
        let translate = this.calcTranslationMatrix(ctx)
        let rotation = this.calcRotationMatrix()
        return multiply_matrices(translate, rotation)
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
    setText(text) {
        this.text = text
    }
}