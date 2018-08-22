import srv from 'socket.io'

let io = srv(3001)

io.on('connection', function (socket) {
    console.log('connexion started')
    socket.on('getstats', function (msg,from) {
        console.log("recieved getstats")
        console.log('answering to ', from)
    })
    socket.on('training', function (msg,from) {
        console.log("recieved Training data")
        console.log('answering to ', from)
        console.log(msg)
    })
})


