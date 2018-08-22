import websocket from 'ws';
import http from 'http'
import express from 'express'

import error from './models/error'
import task from './models/task'
import login from './models/login'
import redis from 'redis'
import redisWssBroadCaster from './redisWssBroadCaster/redisWssBroadCaster'
import CommandManager from './CommandManager/CommandManager' 
import getKeys from './utils/utils'
const app = express();
const server = http.createServer(app);
const redis_host= process.env.REDIS_HOST
const host = "redis://" + redis_host + ":6379";

//redisclient will read keys from server, we get notified of new keys from redisSub
const redisClient = redis.createClient(host)
const redisSub = redis.createClient(host)
redisClient.select(2)
// redisServer will send keys mainly to the workers, pub notifies listeners of the new key
const redisServer = redis.createClient(host)
const redisPub = redis.createClient(host)
redisServer.select(1)

let wss = new websocket.Server({ server });
wss.broadcast = function broadcast(data) {
  console.log("BROADCASTING TO CLIENTS")
  wss.clients.forEach(function each(client) {
    if (client.readyState === websocket.OPEN) {
      client.send(data);
    }
  });
};

let channels = ['ft.notifs.*','mon.*','upload.*']
//TODO this will be updated on startup from a redis key with a specific expiration timer. To test ui, I just populate data on WSS start.



let RedisCustomListener = new redisWssBroadCaster(wss,redisSub,redisServer,channels)
RedisCustomListener.start()

app.on('upgrade', wss.handleUpgrade);
console.log("Websocket Server Started") 

//ui is interested into events from fasttext and the monitoring systems


let CM = new CommandManager(redisServer, redisPub)

wss.on('connection', ws => {
  console.log('web socket connection is alive');
  ws.on("error", (err) => {
    console.log("Caught flash policy server socket error: ")
    console.log(err.stack)}
  )
  
  const onSetTaskList = (l) => {
    console.log('inside callback')
    ws.send(JSON.stringify({'tasks' : l }))
  }
  const onSetErrorList = (l) => {
    console.log('inside callback')
    ws.send(JSON.stringify({'errors' : l }))
  }

  const onSetLoginList = (l) => {
    console.log('inside callback')
    ws.send(JSON.stringify({'logins' : l }))
  }     
  
  getKeys(redisClient,'ft.*','fasttext',task).then((l) => { 
    console.log('inside then',l)
    onSetTaskList(l)})
  getKeys(redisClient,'error.*','error',error).then((l) => { 
      console.log('inside then',l)
      onSetErrorList(l)})
  getKeys(redisClient,'login.*','login',login).then((l) => { 
        console.log('inside then',l)
        onSetLoginList(l)})
      

  ws.on('message', (message) => {
    let m = JSON.parse(message)
    console.log(m)
    let response = CM.sendAction(m)
    ws.send(JSON.stringify(response))
  })
})

server.listen(3001, () => {
  console.log(`Server started on port ${server.address().port} :)`);
});

