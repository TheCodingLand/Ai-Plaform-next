




export default class training {
    constructor() {
        this.trigger = "training"
        this.missingfields= []
        this.requiredFields = ['dataset', 'model', 'version', 'epochs', 'splitlang']
        
      //  { "text": "training", "model":"test", "dataset":"test1"}


    }
    run(message) {
        this.missingfields=[]
        console.log(message)
        this.requiredFields.forEach(field => { 
                if (!message.hasOwnProperty(field))
                {
                    this.missingfields.push(field)
                
             }})
        
        if (this.missingfields.length>0) {
            let fields =""
            this.missingfields.forEach(field => {fields = fields+','+field })
            return { key: 'error.', action : 'training', type: 'error', message: 'missing field :' + fields.slice(1)}
        }
        return {key:'ft.training.'+message.dataset, 
        action : 'training',
        dataset: message.dataset,
        learningRate: 0.2,
        ngrams: 3, 
        datasetversion: '2', 
        model : message.model, 
        version: message.version, 
        epochs: message.epochs,
        splitlang: message.splitlang  }

        //this.redisinstance.hmset('ft.training'+message.name, { name: message.name, model : message.model })
        
        //this.redisinstance.publish('ft.training', 'ft.training.'+message.name)
    

        //return { action : 'ft.training', name: 'ok', message: 'training command sent'}
        

    }

}