import Vue from 'vue'

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export const state = () => ({
    initialized: null,
    model: null,
    template_selection: null,
    colors: [],
    logos: {},
    active_panel: "templates",
    template_color_focus: 0
})

export const mutations = {
    initialize(state) {
        state.initialized = true
    },
    load_model(state, model) {
        state.model = model
        state.template_selection = 0
    },
    set_logo(state, logo) {
        Vue.set(state.logos, logo.uuid, logo)
    },
    remove_logo(state, logo) {
        Vue.delete(state.logos, logo.uuid)
    },
    set_template(state, { index, colors }) {
        state.template_selection = index
        state.colors = colors
    },
    set_colors(state, colors) {
        state.colors = colors
    },
    select_panel(state, panel) {
        state.active_panel = panel
    },
    template_color_focus(state, focus) {
        state.template_color_focus = focus
    }
}

export const actions = {
    async initialize(context, payload) {
        await context.dispatch('load_model', payload)
        context.commit('initialize')
    },
    async load_model(context, { renderer, model_url }) {
        let model = await fetch(model_url).then(r => r.json())
        let colors = await renderer.setModel(model)
        context.commit('load_model', model)
        context.commit('set_colors', colors)
    },
    async set_logo(context, { renderer, logo, position }) {
        let new_logo = {...logo}
        if (!new_logo.uuid)
            new_logo.uuid = uuidv4()
        new_logo.position = position 
        await renderer.setLogo(new_logo)
        context.commit('set_logo', new_logo)
    },
    remove_logo(context, { renderer, logo }) {
        renderer.removeLogo(logo.uuid)
        context.commit('remove_logo', logo)
    },
    async set_template(context, { renderer, index }) {
        // TODO move inside renderer
        if (!context.state.model || !context.state.model.templates)
             throw "Tried to set template, but model is not initialized"
        else if (!context.state.model.templates[index])
            throw "Index specified doesn't correspond to a template"
        let colors = await renderer.setTemplate(index)
        context.commit('set_template', { index, colors })
    },
    async set_color(context, { renderer, index, color }) {
        if (!context.state.colors)
             throw "Tried to set template color, but it's not initialized"
        else if (!context.state.colors[index])
            throw "Index specified doesn't correspond to a color slot"
        let colors = await renderer.setTemplateColor(index, color)
        context.commit('set_colors', colors)
    }
}