import srv from 'socket.io'
import redis from 'redis'
import redisBroadCaster from './redisBroadCast/redisBroadCaster'

const redis_host= process.env.REDIS_HOST
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
    redisOut.hmset(data.key,data)
    redisPub.publish(data.key, data.key)
}


let io = srv(3001)

let eventsToListenTo = ['getstats','training','testing', 'optimize', 'upload', 'login', 'datasetlist']
let redisEventsToListenTo = ['trainingresult', 'trainingstats', 'loginresult','predictionresult', 'stats', 'datasetcolumns', 'notifications']


//Transforms web request into a valid command for our workers
const makeRedisObj = (channel,message) => {
    if (channel === 'training') {
        var obj = Object.assign({},
            message, 
            {key:'ft.training.'+message.dataset, 
            action : 'training',
            learningRate: 0.2,
            ngrams: 3, 
            datasetversion: '2',
            }
            )
        console.log(obj)        
        return obj  

        }
        if (channel === 'testing') {
            var obj = Object.assign({},
                message, 
                {key:'ft.testing.'+message.dataset, 
                action : 'testing'
                }
                )
            console.log(obj)        
            return obj  
            }
}

//This sends back redis events to the frontend through the websocket, as broadcast
const redisBroadCast = new redisBroadCaster(io,redisSub,redisIn,redisEventsToListenTo)
redisBroadCast.start()


//Listens to channels from the websockets and relays them to redis
const listenTo = (channel, socket) => {
    socket.on(channel, function (msg) {
        console.log(`recieved ${channel} data`)
        console.log(msg)
        let obj = makeRedisObj(channel,msg)
        publishToredis(obj)
    })
}


io.on('connection', function (socket) {
    //registering listening channels
    console.log('connexion started')
    eventsToListenTo.forEach(channel => {
        listenTo(channel, socket)
    });
   
})


