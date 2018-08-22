//This class opens a subscription on a redis channel and broadcasts the corresponding key to all client as a json object
// IMPORTANT : the system creating the redis key must create : a Publish to the redis server with the exact key name like 
// ft.training AND a key with the exact same name inside the db. this ensures a good pub/sub communication.

export default class redisWssBroadCaster {

    constructor(wss, redisSub, redisClient, channels) {
        this.wss = wss
        this.redisSub = redisSub
        this.redisClient = redisClient
        this.channels = channels
        }
        start() {
            this.channels.forEach(channel => {
                this.redisSub.psubscribe(channel)
                console.log("subribing to channel " + channel)
            });
            this.redisSub.on('pmessage', (channel, key) => this.getRedisKey(channel,key))
            
        }
    

        getRedisKey(channel, key) 
            {
            
            console.log("getting key from subscription")
            console.log(channel)
            console.log(key)
            this.redisClient.hgetall(key, (err,result) => {
                if (!err) {
                    
                    
                        //result = {key:key, action : "training started"}
                        this.wss.broadcast(JSON.stringify(result))}})
                    
            }
}