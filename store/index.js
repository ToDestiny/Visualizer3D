import Vue from 'vue'
import Renderer from '../static/renderer/renderer'
import { load_zipped } from '../static/ziptoconfig'
import axios from 'axios'

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
    text_slots: {},
    user_token: ""
})

export const mutations = {
    initialize(state) {
        state.initialized = true
    },
    load_model(state, model) {
        state.model = model
    },
    set_logo(state, logo) {
        Vue.set(state.logos, logo.uuid, logo)
    },
    remove_logo(state, logo) {
        Vue.delete(state.logos, logo.uuid)
    },
    clear_logos(state) {
        state.logos = {}
    },
    set_template(state, { index, colors }) {
        state.template_selection = index
        state.colors = colors
    },
    set_colors(state, colors) {
        state.colors = colors
    },
    set_text_slots(state, text_slots) {
        state.text_slots = text_slots
    },
    set_user_token(state, token) {
        state.user_token = token
    }
}

export const actions = {
    async initialize(context, payload) {
        await context.dispatch('load_model', payload)
        if ('load_id' in payload) {
            let url = window.atob(payload['load_id'])
            await axios.get(url, { responseType: 'blob' })
                .then((response) => load_zipped(context, payload.renderer, response.data))
        }
        context.commit('initialize')
    },
    async load_model(context, { renderer, model_url }) {
        let model = await Renderer.fetchConfig(model_url)
        // load model
        let fresh_data = await renderer.setModel(model)
        context.commit("load_model", model)
        context.commit("set_template", {
            index: fresh_data.template_index,
            colors: fresh_data.colors
        })
        context.commit("clear_logos")
        context.commit("set_text_slots", fresh_data.text_slots)
    },
    async set_logo(context, { renderer, logo, position }) {
        let new_logo = {...logo}
        if (!new_logo.uuid)
            new_logo.uuid = uuidv4()
        new_logo.position = position 
        await renderer.setLogo(new_logo)
        context.commit("set_logo", new_logo)
    },
    remove_logo(context, { renderer, logo }) {
        renderer.removeLogo(logo.uuid)
        context.commit("remove_logo", logo)
    },
    async set_template(context, { renderer, index }) {
        // TODO move inside renderer
        if (!context.state.model || !context.state.model.templates)
             throw "Tried to set template, but model is not initialized"
        else if (!context.state.model.templates[index])
            throw "Index specified doesn't correspond to a template"
        let colors = await renderer.setTemplate(index)
        context.commit("set_template", { index, colors })
    },
    async set_color(context, { renderer, index, color }) {
        if (!context.state.colors)
             throw "Tried to set template color, but it's not initialized"
        else if (!context.state.colors[index])
            throw "Index specified doesn't correspond to a color slot"
        let colors = await renderer.setTemplateColor(index, color)
        context.commit("set_colors", colors)
    },
    set_text(context, { renderer, text, color, slot }) {
        renderer.setText({ text, color }, slot)
        context.commit("set_text_slots", renderer.getTextSlots())
    },
    async load_config(context, { renderer, model }) {
        let loaded = await renderer.loadConfig(model)
        if (!loaded)
            throw "Error while loading config"
        context.commit("set_template", { index: loaded.template_index, colors: loaded.colors })
        loaded.logos.forEach((logo) => context.commit("set_logo", logo))
        context.commit("set_text_slots", loaded.text_slots)
    },
    set_user_token(context, token) {
        context.commit("set_user_token", token)
    }
}