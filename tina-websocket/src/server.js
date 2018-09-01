import srv from "socket.io";
import redis from "redis";

const redis_host = process.env.REDIS_HOST;
const host = "redis://" + redis_host + ":6379";

//redisIn will read keys from server, we get notified of new keys from redisSub
const redisIn = redis.createClient(host);
const redisSub = redis.createClient(host);
redisIn.select(2);
// redisOut will send keys mainly to the workers, pub notifies listeners of the new key
const redisOut = redis.createClient(host);
const redisPub = redis.createClient(host);
redisOut.select(1);

const publishToredis = data => {
  redisOut.hmset(data.key, data);
  redisPub.publish(data.key, data.key);
};

let io = srv(3001);

const initClientChannels = () => {
  //This will be to hand socket scaling, we will get active sessions from redis and active tasks
  key = "socket.registeredClients";
  redisIn.get(key, (err, r) => {
    if (!err) {
      if (r !== null) {
        JSON.parse(r);
      }
    }
  });
};

//Listens to channels from the websockets and relays them to redis

redisSub.on("pmessage", (channel, key) => {
  redisIn.hgetall(key, (err, r) => {
    if (!err) {
      //result = {key:key, action : "training started"}

      console.log(
        "recieved event from redis, sending to wo registered for this",
        key
      );

      clients.forEach(socket => {
        console.log("keys registerd with client :", socket.redisSubKeys);
        socket.redisSubKeys.forEach(registeredkey => {
          if (registeredkey === key) {
            console.log("found it, sending info", r);
            socket.emit(r.id, r);
          }
        });
      });
    }
    redisIn.expire(key, 10);
  });
});

const clients = [];

io.on("connection", function(socket) {
  //registering listening channels
  console.log("connexion started");
  //holding the listof redis subs in keys list
  socket.redisSubKeys = [];
  clients.push(socket);

  WebSocketListenTo("message", socket);

  socket.on("disconnect", () => {
    socket.redisSubKeys.forEach(key => {
      console.log("unsubscribing to :", key);
      redisSub.unsubscribe(key);
      clients.pop(socket);
    });
  });
});

const WebSocketListenTo = (channel, socket) => {
  socket.on(channel, function(msg) {
    //Recieved msg from websocket
    console.log(`recieved ${channel} from ${socket} client`);
    //console.log(msg)

    clientPushToRedisAndSub(socket, msg);

    console.log(msg.id);
    //socket.emit(msg.id, JSON.stringify(msg))
  });
};

const clientPushToRedisAndSub = (client, obj) => {
  console.log("subscribing to", obj.id);
  redisSub.psubscribe(obj.id);
  client.redisSubKeys.push(obj.id);
  publishToredis(obj);
};
