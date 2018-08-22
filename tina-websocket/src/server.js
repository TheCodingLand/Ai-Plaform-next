import srv from 'socket.io'
import redis from 'redis'
import redisBroadCaster from './redisBroadCast/redisBroadCaster'

const redis_host= process.env.REDIS_HOST
const host = "redis://" + redis_host + ":6379";

//redisclient will read keys from server, we get notified of new keys from redisSub
const redisIn = redis.createClient(host)
const redisSub = redis.createClient(host)
redisIn.select(2)
// redisServer will send keys mainly to the workers, pub notifies listeners of the new key
const redisOut = redis.createClient(host)
const redisPub = redis.createClient(host)
redisOut.select(1)



const publishToredis = (data) => {
    redisOut.hmset(data.key)
    redisPub.publish(data.key)    
}


let io = srv(3001)

let eventsToListenTo = ['getstats','training','testing', 'optimize', 'upload', 'login', 'datasetlist']
let redisEventsToListenTo = ['trainingresult', 'trainingstats', 'loginresult','predictionresult', 'stats', 'datasetcolumns', 'notifications']

const makeRedisObj = (channel,msg) => {
    if (channel === 'training') {
        return { training:
    {
    key:'ft.training.'+message.dataset, 
    action : 'training',
    dataset: message.dataset,
    learningRate: 0.2,
    ngrams: 3, 
    datasetversion: '2', 
    model : message.model, 
    version: message.version, 
    epochs: message.epochs,
    splitlang: message.splitlang  }

}}}

const redisBroadCast = new redisBroadCaster(io,redisSub,redisIn,redisEventsToListenTo)
redisBroadCast.start()

const listenTo = (channel, socket) => {
    socket.on(channel, function (msg) {
        console.log(`recieved ${channel} data`)
        console.log(msg)
        obj = makeRedisObj(channel,msg)
        publishToredis(obj)
    })
}

io.on('connection', function (socket) {
    //registering listening channels
    console.log('connexion started')
    eventsToListenTo.forEach(channel => {
        listenTo(channel, socket)
    });
    /* socket.on('getstats', function (msg) {
        console.log("recieved getstats")
        console.log(msg)
    })
    socket.on('training', function (msg) {
        console.log("recieved Training data")
        console.log(msg)
    })
    socket.on('testing', function (msg) {
        console.log("recieved testing data")
        console.log(msg)
    })
    socket.on('optimize', function (msg) {
        console.log("recieved optimoize command")
        console.log(msg)
    })
    socket.on('upload', function (msg) {
        console.log("recieved upload")
        console.log(msg)
    }) */

    //
})


