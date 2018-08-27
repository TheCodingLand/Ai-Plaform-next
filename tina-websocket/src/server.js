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

let eventsToListenTo = ['getstats','training','testing', 'optimize', 'upload', 'login', 'datasetlist', 'state']
let redisEventsToListenTo = ['trainingresult', 'trainingstats', 'loginresult','predictionresult', 'stats', 'datasetcolumns', 'notifications','state']


//gets app workers state from a static redis key called state on client request
const getState = (socket) => {
    redisIn.hgetall('state', (err,result) => {
    if (!err) {
            console.log(state)
            socket.emit('state', JSON.stringify(result))}})
//Updates the state of workers typically this would be done from elsewhere, like the workers themselves
const setState = (mods) => {
    let state = redisIn.hgetall('state', (err,result) => {
        if (!err) {
                state= Object.assign({}, result, mods)
        }})
        //state is always on db 1
        console.log(state)
        redisIn.hmset('state', state)
    }


}
const clientSpecificRedisSub = (client,key) => {
    redisSub.psubscribe(key)
    redisSub.on('pmessage', (channel, key) => { redisIn.hgetall(key, (err,result) => {
        if (!err) {  
            //result = {key:key, action : "training started"}
            client.emit(channel, JSON.stringify(result))}}
            
        )
        redisIn.expire(key,10)

           
        })

    }


//Transforms web request into a valid command for our workers
const makeRedisObj = (client,channel,message) => {
    if (channel === 'training') {
        var obj = Object.assign({},
            message, 
            {key:'ft.training.'+message.id, 
            action : 'training',
            
            model:JSON.stringify(message.model),
            dataset:JSON.stringify(message.dataset),
            }
            )
        console.log(obj)
        clientSpecificRedisSub(client, obj.key)
        return obj  

        }
        if (channel === 'testing') {
            var obj = Object.assign({},
                message,
                {key:'ft.testing.'+message.id,
                action : 'testing',
                model:JSON.stringify(message.model),
                dataset:JSON.stringify(message.dataset)
                }
                )
            //console.log(obj)        
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
        //console.log(msg)
        let obj = makeRedisObj(socket,channel,msg)
        publishToredis(obj)
        
        let parsed = JSON.parse(msg)
        console.log(parsed)
        socket.emit(parsed.id, JSON.stringify({text:'Started'}))
    })
}


io.on('connection', function (socket) {
    //registering listening channels
    console.log('connexion started')
    eventsToListenTo.forEach(channel => {
        listenTo(channel, socket)
    });
   
})


