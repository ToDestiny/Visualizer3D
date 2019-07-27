export const state = () => ({
    initialized: null,
    model: null,
    template_selection: null,
    logos: {},
    active_panel: "templates"
})

function _do_mutate_model(state, model) {
    state.model = model
    state.template_selection = 0
}

export const mutations = {
    initialize(state, model) {
        state.initialized = true
        _do_mutate_model(state, model)
    },
    load_model(state, model) {
        _do_mutate_model(state, model)
    },
    set_logo(state, logo) {
        state.logos = {...state.logos}
        state.logos[logo.uuid] = logo
    },
    remove_logo(state, uuid) {
        state.logos = {...state.logos}
        delete state.logos[uuid]
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
        renderer.setModel(model)
        context.commit('initialize', model)
    },
    async load_model(context, { renderer, model_url }) {
        let model = await fetch(model_url).then(r => r.json())
        renderer.setModel(model)
        context.commit('load_model', model)
    },
    set_logo(context, { renderer, logo }) {
        renderer.setLogo(logo)    
        context.commit('set_logo', logo)
    },
    remove_logo(context, { renderer, uuid }) {
        renderer.removeLogo(uuid)
        context.commit('remove_logo', uuid)
    },
    set_template(context, { renderer, index }) {
        // TODO move inside renderer
        if (!context.state.model || !context.state.model.templates)
             throw "Tried to set template, but model is not initialized"
        else if (!context.state.model.templates[index])
            throw "Index specified doesn't correspond to a template"
        renderer.setTemplate(index)
        context.commit('set_template', index)
    },
    select_panel(context, panel) {
        context.commit('select_panel', panel)
    }
}