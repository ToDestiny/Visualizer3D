import Vue from 'vue'

function _do_mutate_model(state, model) {
    state.model = model
    state.template_selection = 0
}

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
    logos: {},
    active_panel: "templates"
})

export const mutations = {
    initialize(state, model) {
        state.initialized = true
        _do_mutate_model(state, model)
    },
    load_model(state, model) {
        _do_mutate_model(state, model)
    },
    set_logo(state, logo) {
        Vue.set(state.logos, logo.uuid, logo)
    },
    remove_logo(state, logo) {
        Vue.delete(state.logos, logo.uuid)
    },
    set_template(state, index) {
        state.template_selection = index
    },
    select_panel(state, panel) {
        state.active_panel = panel
    }
}

export const actions = {
    async initialize(context, { renderer, model_url }) {
        let model = await fetch(model_url).then(r => r.json())
        await renderer.setModel(model)
        context.commit('initialize', model)
    },
    async load_model(context, { renderer, model_url }) {
        let model = await fetch(model_url).then(r => r.json())
        await renderer.setModel(model)
        context.commit('load_model', model)
    },
    async set_logo(context, { renderer, logo, position }) {
        let new_logo = {...logo}
        if (!new_logo.uuid)
            new_logo.uuid = uuidv4()
        new_logo.position = position 
        context.commit('set_logo', new_logo)
        renderer.setLogo(new_logo)
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
        await renderer.setTemplate(index)
        context.commit('set_template', index)
    }
}