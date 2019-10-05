export default class Observable {
    constructor() {
        this._event_listeners = {}
    }
    fire(event_name, options) {
        if (this._event_listeners[event_name]) {
            Object.keys(this._event_listeners[event_name]).forEach((key) => {
                this._event_listeners[event_name][key].handler(this, event_name, options || {})
                if (this._event_listeners[event_name][key].autoremove)
                    delete this._event_listeners[event_name][key]
            })
        }
    }
    on(event_name, handler, autoremove=false) {
        if (!this._event_listeners[event_name])
            this._event_listeners[event_name] = []
        this._event_listeners[event_name].push({
            handler,
            autoremove
        })
    }
    off(event_name, handler) {
        let event_listener = this._event_listeners[event_name]
        delete event_listener[event_listener.indexOf(handler)]
    }
}