const Ws = require('./connect')

class WS extends Ws {
    constructor(...args) {
        super(...args)

        this.___interval = 0
        this.___count = 0

        this.on('open', this.___ONOPEN)
        this.on('close', this.___ONCLOSE)

    }

    stop = () => {
        this.interval = 0
        this.close()
    }
    start = (int) => {
        if (int) this.interval = int
        else this.interval = this._reconnectInterval

        this.connect()
    }

    setInterval = (int) => {
        if (typeof int != 'number') throw 'interval must be a number'
        this._reconnectInterval = int
        this.interval = int
    }


    set interval(val) {
        if (typeof val != 'number') throw 'interval must be a number'
        this.___interval = val
    }
    get interval() {
        return this.___interval
    }

    ___ONOPEN = () => {
        this.___count = 0
    }

    ___ONCLOSE = () => {
        if (this.interval) {
            this.state = 'connecting'

            if (this.___count === 0) {
                this.___count++
                this.connect()
            } else {
                let dis = this
                setTimeout(function () {
                    dis.connect()
                }, dis.interval)
            }

        }
    }



}


module.exports = WS