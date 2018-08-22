
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
                        this.wss.emit(this.channel, JSON.stringify(result))}})
                    
            }
}