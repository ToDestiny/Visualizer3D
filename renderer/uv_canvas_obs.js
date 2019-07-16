export default class Observable {
    constructor() {
        this._event_listeners = {}
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
        let event_listener = this._event_listeners[event_name]
        delete event_listener[event_listener.indexOf(handler)]
    }
}