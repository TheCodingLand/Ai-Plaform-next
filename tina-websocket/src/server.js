import srv from 'socket.io'

let io = srv(3001)

let eventsToListenTo = ['getstats','training','testing', 'optimize', 'upload']

const listenTo = (channel, socket) => {
    socket.on(channel, function (msg) {
        console.log(`recieved ${channel} data`)
        console.log(msg)
    })
}

io.on('connection', function (socket) {
    //registering listening channels
    console.log('connexion started')
    eventsToListenTo.forEach(channel => {
        listenTo(channel, socket)
    });
    /* socket.on('getstats', function (msg) {
        console.log("recieved getstats")
        console.log(msg)
    })
    socket.on('training', function (msg) {
        console.log("recieved Training data")
        console.log(msg)
    })
    socket.on('testing', function (msg) {
        console.log("recieved testing data")
        console.log(msg)
    })
    socket.on('optimize', function (msg) {
        console.log("recieved optimoize command")
        console.log(msg)
    })
    socket.on('upload', function (msg) {
        console.log("recieved upload")
        console.log(msg)
    }) */

    //
})


