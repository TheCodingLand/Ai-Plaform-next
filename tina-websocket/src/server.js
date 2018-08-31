import srv from 'socket.io'
import redis from 'redis'
import redisBroadCaster from './redisBroadCast/redisBroadCaster'

const redis_host = process.env.REDIS_HOST
const host = "redis://" + redis_host + ":6379";

//redisIn will read keys from server, we get notified of new keys from redisSub
const redisIn = redis.createClient(host)
const redisSub = redis.createClient(host)
redisIn.select(2)
// redisOut will send keys mainly to the workers, pub notifies listeners of the new key
const redisOut = redis.createClient(host)
const redisPub = redis.createClient(host)
redisOut.select(1)



const publishToredis = (data) => {
    redisOut.hmset(data.key, data)
    redisPub.publish(data.key, data.key)
}


let io = srv(3001)

let eventsToListenTo = ['getstats', 'training', 'testing', 'optimize', 'upload', 'login', 'datasetlist', 'state']
let redisEventsToListenTo = ['trainingresult', 'trainingstats', 'loginresult', 'predictionresult', 'stats', 'datasetcolumns', 'notifications', 'state']


//gets app workers state from a static redis key called state on client request
const getState = (socket) => {
    redisIn.hgetall('state', (err, result) => {
        if (!err) {
            console.log(state)
            socket.emit('state', JSON.stringify(result))
        }
    })
    //Updates the state of workers typically this would be done from elsewhere, like the workers themselves
    const setState = (mods) => {
        let state = redisIn.hgetall('state', (err, result) => {
            if (!err) {
                state = Object.assign({}, result, mods)
            }
        })
        //state is always on db 1
        console.log(state)
        redisIn.hmset('state', state)
    }


}
const clientSpecificRedisSub = (client, obj) => {
    console.log('subscribing to', obj.id)
    redisSub.psubscribe(obj.id)
    client.keys.push(obj.id)



}


//Transforms web request into a valid command for our workers
const makeRedisObj = (client, channel, message) => {
    if (channel === 'training') {
        var obj = Object.assign({},
            message,
            {
                key: 'ft.training.' + message.id,
                action: 'training',

                model: JSON.stringify(message.model),
                dataset: JSON.stringify(message.dataset),
            }
        )
        console.log(obj)
        clientSpecificRedisSub(client, obj)
        return obj

    }
    if (channel === 'testing') {
        var obj = Object.assign({},
            message,
            {
                key: 'ft.testing.' + message.id,
                action: 'testing',
                model: JSON.stringify(message.model),
                dataset: JSON.stringify(message.dataset)
            }
        )

        clientSpecificRedisSub(client, obj)
        return obj
    }
    if (channel === 'predict') {
        var obj = Object.assign({},
            message,
            {
                key: 'ft.predict.' + message.id,
                action: 'predict'
            }
        )

        clientSpecificRedisSub(client, obj)
        return obj
    }

}

//This sends back redis events to the frontend through the websocket, as broadcast
//const redisBroadCast = new redisBroadCaster(io,redisSub,redisIn,redisEventsToListenTo)
//redisBroadCast.start()


//Listens to channels from the websockets and relays them to redis
const listenTo = (channel, socket, keys) => {
    socket.on(channel, function (msg) {
        console.log(`recieved ${channel} data`)
        //console.log(msg)

        let obj = makeRedisObj(socket, channel, msg)
        publishToredis(obj)


        console.log(msg.id)
        //socket.emit(msg.id, JSON.stringify(msg))
        socket.keys.push(obj.id)

    })
}



let clients = []




redisSub.on('pmessage', (channel, key) => {
    redisIn.hgetall(key, (err, r) => {
        if (!err) {
            //result = {key:key, action : "training started"}
            console.log('recieved event from redis, sending to client', key)
            clients.forEach((socket) => {
                socket.emit(key, JSON.stringify(r))
            })
        }
        redisIn.expire(key, 10)
    })
}


)






io.on('connection', function (socket) {
    //registering listening channels
    console.log('connexion started')
    socket.keys = []
    clients.push(socket)
    eventsToListenTo.forEach(channel => {
        listenTo(channel, socket)
    });

    socket.redisSub = redisSub


    socket.on('disconnect', () => {
        socket.keys.forEach((key) => {
            console.log('unsubscribing to :', key)
            redisSub.unsubscribe(key)
            clients.pop(socket)
        })
    })
})


