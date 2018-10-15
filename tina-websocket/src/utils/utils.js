const getRedisKey = (redisClient, key) => {
    return new Promise((resolve, reject) => {

        console.log('inside promise 2 (loop)')
        redisClient.hgetall(key, ((err, o) => {

            resolve(o)
        }))



    })
}

const getKeys = (redisClient, keyglob, objname, objclass) => {
    var promise = new Promise((resolve, reject) => {
            console.log('inside promise 1')
            redisClient.keys(keyglob, function (err, replies) {
                console.log(replies.length + " replies:");
                let promises = []
                replies.forEach(function (reply, i) {

                    promises.push(getRedisKey(redisClient, reply))

                    //redisClient.hgetall(reply, ((err,o) => { 

                    //ft_list.push(new task("fasttext",o))
                })
                console.log()
                Promise.all(promises).then((l) => {
                    console.log(l)
                    let objlist = l.map((i) => {
                        return new objclass(objname, i)
                    })
                    console.log(objlist)
                    resolve(objlist)
                }).catch((err) => console.log(err))
            })

        }

    )

    return promise
}





//let o = {key:"ft.notifs.rcslv1", dataset: 'rcslv1', state:"finished",model:"RCSL", version:4, started:"2/8/2018 21:59:15", finished:"2/8/2018 21:59:15" ,result:"ok", confidence:"79%"}



export default getKeys