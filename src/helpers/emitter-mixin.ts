type Constructor = new (...args: any[]) => {}

// This mixin adds a scale property, with getters and setters
// for changing it with an encapsulated private property:

export function Emitter<TBase extends Constructor>(Base: TBase) {
  return class Emitter extends Base {
    // Map of string containing a list of callback
    _emitterEvents = new Map<string, Map<Symbol, Function>>()

    on(eventName: string, callback: Function) {
      if (!this._emitterEvents.has(eventName)) {
        this._emitterEvents.set(eventName, new Map())
      }

      this._emitterEvents.get(eventName).set(Symbol(), callback)
    }

    /**
     * Trigger the callbacks registered for a given event
     */
    emit(eventName: string | string[], ...datas) {
      var eventList = eventName instanceof Array ? eventName : [eventName]

      eventList.forEach(name => {
        if (this._emitterEvents.has(name)) {
          this._emitterEvents.get(name).forEach(callback => {
            callback.call(this, ...datas)
          })
        }
      })

      return this
    }

    /**
     * Register a callback for an event that will be triggered once.
     */
    once(event, callback) {
      var onceCallback = e => {
        callback.call(this, e)
        this.off(event, onceCallback)
      }
      this.on(event, onceCallback)

      return this
    }

    /**
     * Unregister a callback from an event
     */
    off(eventName, callback) {
      if (!this._emitterEvents.has(eventName)) return null

      this._emitterEvents.get(eventName).forEach((c, i) => {
        if (c === callback) {
          this._emitterEvents.get(eventName).delete(i)
        }
      })

      return this
    }
  }
}
