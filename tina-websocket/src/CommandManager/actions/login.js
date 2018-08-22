




export default class login {
    constructor() {
        this.trigger = "login"
        this.missingfields= []
        this.requiredFields = ['username', 'password']
        
     

    }
    run(message) {
        this.requiredFields.forEach(field => { 
                if (!message.hasOwnProperty(field))
                {
                    this.missingfields.push(field)
                
             }})
        
        if (this.missingfields.length>0) {
            let fields =""
            this.missingfields.forEach(field => {fields = fields+','+field })
            return { key: 'error.', action : this.trigger, type: 'error', message: 'missing field :' + fields.slice(1)}
        }
        return {key:'login.'+message.username,username:message.username ,password: message.password }

        //this.redisinstance.hmset('ft.training'+message.name, { name: message.name, model : message.model })
        
        //this.redisinstance.publish('ft.training', 'ft.training.'+message.name)
    

        //return { action : 'ft.training', name: 'ok', message: 'training command sent'}
        

    }

}