import training from './actions/training'
import predict from './actions/training'
import login from './actions/login'


export default class CommandManager {

    constructor(redisServer, redisPub) {
       
        this.redisServer = redisServer
        this.redisPub= redisPub
      
        this.actions =[
            new training(),
            new login(), 
            new predict(), 
           // action.upload,
            //action.login
        ]
        }
        updateRedis(obj) {
            
            console.log('object to push to redis :' )
            console.log(obj)
            if (obj.key !== 'unknown') {
            this.redisServer.hmset(obj.key, obj)
            this.redisPub.publish(obj.key, obj.key)
        }   
        }
        
        sendAction(message) 
        {   
            let response = {key: 'unknown', action : 'unknown', type: 'error', message: 'unknown action'}
            this.actions.forEach(action => {
            if (message.action === action.trigger) {
                
                response = action.run(message)
            }
            
        })
        console.log(response)
        this.updateRedis(response)

        return response
        }
}