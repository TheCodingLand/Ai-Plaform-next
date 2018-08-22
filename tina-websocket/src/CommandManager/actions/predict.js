


export default class predict {
    constructor(redisinstance) {
        this.trigger = "predict"
        this.redisinstance = redisinstance
        this.requiredFields = ['name', 'model', 'dataset', 'text']
    
    }
    run(message){
        this.requiredFields.forEach(field => { 
            if (field in message )
        { } else {
            return { action : 'predict', type: 'error', message: 'missing field : ' + field}
        }
        })

        this.redisinstance.hmset('ft.predict'+message.text+'.'+message.model, { name: message.name, model : message.model }).then(() => {
        this.redisinstance.publish('ft.predict', 'ft.predict.'+message.text+'.'+message.model)})

        return { action : 'predict', type: 'ok', message: 'predict command sent'}
        

    }

}