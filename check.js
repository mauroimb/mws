const WebSockets = require('ws')


class WS extends WebSockets {
    constructor(...args) {
        super(...args)
        this.___activityTimeout = false
        this.___pongTimeout = false
        this.___activityTimer = null
        this.___pongTimer = null
        this.___checking = false
        this.___killer = false
    }
    get checking() { return this.___checking }
    set checking(bool) {
        if (typeof bool != 'boolean') throw 'checking argument must be boolean: ' + bool
        return this.___checking = bool
    }

    check = (activityTimeout, pongTimeout, killer) => {

        if (!activityTimeout || !pongTimeout) throw new Error('missing arguments')
        this.checking = true
        this.___activityTimeout = activityTimeout
        this.___pongTimeout = pongTimeout
        if (killer) this.___killer = true

        let dis = this
        this.prependListener('message', dis.___refresh)
        this.prependListener('pong', dis.___refresh)
        if (killer) this.on('lost', this.___onLost)

        this.once('open', function () {
            dis.___activityTimer = setTimeout(dis.___timed, dis.___activityTimeout)
            dis.prependListener('open', dis.___refresh)
        })
    }

    stopChecking = () => {

        this.checking = false
        let dis = this
        this.removeListener('message', dis.___refresh)
        this.removeListener('open', dis.___refresh)
        this.removeListener('pong', dis.___refresh)
        clearTimeout(dis.___activityTimer)
        clearTimeout(dis.___pongTimer)

    }

    ___refresh = () => {
        if (!this.___activityTimer) throw 'check activity error: no timer set'
        return this.___activityTimer.refresh()
    }

    ___timed = () => {

        if (this.readyState !== 1) return this.emit('lost')

        this.emit('knock')

        let dis = this

        this.___pongTimer = setTimeout(function () {
            dis.emit('lost')
            dis.removeListener('pong', dis.___pong)
        }, dis.___pongTimeout)

        this.prependOnceListener('pong', dis.___pong)

        this.ping()

    }

    ___pong = () => {
        clearTimeout(this.___pongTimer)
    }

    ___onLost = () => {
        this.terminate()
    }




}


module.exports = WS