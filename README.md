# mws
semplice estensione della libreria websocket [ws](https://github.com/websockets/ws)
```
const ws = new Mws(options) 
```

Aggiunge metodi per controllare periodicamente lo stato del canale e gestire automaticamente la riconnessione.

## check

```
ws.check(activityTimeout, pongTimeout, killer=false)
```

- invia un ping dopo "activityTimeout" secondi che la connessione non dà segni di vita, emettendo l'evento "knock"
- se il segnale di pong non arriva entro "pongTimeout" millisecondi, emette l'evento "lost"
- se killer = true, quando arriva l'evento 'lost' termina la connessione.

```
ws.stopChecking()
```

per interrompere

## connect

```
ws.connect()
e ws.close(), ws.terminate()
```

rispettivamente aprono e chiudono la connessione, conservando i listeners.

## reconnect

```
ws.interval = 1000
```

settando un intervallo diverso da 0, ogni volta che la connessione cade la libreria proverà a riavviare la connessione.
La prima volta il riavvio partirà immediatamente dopo la chiusura, dalla seconda volta in poi, invece, aspetterà 'interval' millisecondi prima di riconnettere.


```
ws.interval = false (oppure = 0)
```

per smettere.

Per chiudere la connessione *senza* riconnettersi, usare il metodo 
```
ws.stop()
```
Si può anche avviare la connessione con 
```
ws.start(interval)
```
che setta l'intervallo di riconenssione e avvia connect.
la prossima volta che si invoca start, si ripartirà con lo stesso interval.

Per memorizzare l'intervallo si può usare 

``` ws.setInterval(interval)```


e poi avviare e fermare la connessione con 
```
ws.start()
ws.stop()
```

## STATE

viene esposta la variabile "state", che può presentarsi in 3 stati:
|              |            |           |
| ------------ | ---------- | --------- |
| disconnected | connecting | connected |
|              |            |           |

ogni volta che lo stato cambia viene emesso l'evento "state" che restituisce l'oggetto 
```
ws.on('state', function(ogg){
    ogg = {
        previous: 'disconnected', 
        current: 'connecting'
    }
})
