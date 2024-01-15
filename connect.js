const Ws = require('./check')

class WS {
    constructor(...args) {
        this.client = undefined
        this.___args = args
        this.___checkArgs = undefined


        this.___events = {}
        this.___state = 'disconnected' // [ 'disconnected', 'connecting', 'closing', 'connected']


        this.methods()

    }

    set state(current) {
        let dis = this
        let previous = dis.___state
        dis.___state = current
        return this.emit('state', { previous: previous, current: current })
    }

    get state() {
        return this.___state
    }

    ___onOpen = () => {
        this.state = 'connected'
    }

    ___onClose = () => {
        this.state = 'disconnected'
    }


    get binaryType() { if (this.client) return this.client.binaryType }
    get bufferedamount() { if (this.client) return this.client.bufferedAmount }
    get extensions() { if (this.client) return this.client.extensions }
    get protocol() { if (this.client) return this.client.protocol }
    get readyState() { if (this.client) return this.client.readyState }
    get url() { return this.client.url }

    connect = () => {
        this.state = 'connecting'
        this.client = new Ws(...this.___args)
        for (let e in this.___events) {
            for (let i = 0; i < this.___events[e].length; i++) {
                this.client.on(e, this.___events[e][i])
            }
        }
        if (this.___checkArgs) this.client.check(...this.___checkArgs)
        this.client.prependListener('open', this.___onOpen)
        this.client.prependListener('close', this.___onClose)
    }


    on = (event, handler) => {
        if (!this.___events.hasOwnProperty(event)) this.___events[event] = []
        this.___events[event].push(handler)
        if (this.client) return this.client.on(event, handler)
    }

    emit = (event, ...args) => {
        if (this.client) this.client.emit(event, ...args)
        else {
            for (let i in this.___events[event]) {
                this.___events[event][i](...args)
            }
        }
    }

    prependListener = (event, handler) => {
        if (!this.___events.hasOwnProperty(event)) this.___events[event] = []
        this.___events[event].unshift(handler)
        if (this.client) return this.client.prependListener(event, handler)
    }

    removeListener = (event, handler) => {
        if (this.___events.hasOwnProperty(event)) {
            remove(this.___events[event], handler)
            if (this.client) this.client.removeListener(event, handler)
        }
    }

    removeAllListeners = (event) => {
        if (this.___events.hasOwnProperty(event)) {
            delete this.___events[event]
            if (this.client) this.client.removeAllListeners(event)
        }
    }

    methods = () => {
        let methods = ['ping', 'pong', 'send', 'close', 'terminate']
        let dis = this
        for (let method of methods) {
            this[method] = (...args) => {
                if (dis.client) return dis.client[method](...args)
                else throw new Error('client does not exists yet')
            }
        }
    }





    check = (...args) => {
        this.___checkArgs = args
        if (this.client) {
            if (this.client.checking) throw 'client is already checking connectivity'
            else this.client.check(...args)
        }
    }

    stopChecking = () => {
        this.___checkArgs = undefined
        if (this.client) {
            if (!this.client.checking) throw 'client is not checking connectivity'
            else this.client.stopChecking()
        }
    }

}
module.exports = WS



function remove(array, element) {
    let index = array.indexOf(element)
    if (index != -1) return array.splice(index, 1)
    else return -1
}