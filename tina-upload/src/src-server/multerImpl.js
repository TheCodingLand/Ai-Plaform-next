var shell = require('shelljs');
const redis_host = process.env.REDIS_HOST;
const host = "redis://" + redis_host + ":6379";
var redis = require('redis')
const redisOut = redis.createClient(host);
const redisPub = redis.createClient(host);
redisOut.select(1)

module.exports = (app) => {
    const multer = require('multer');
    const path = require('path');
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        
        let root = app.get('destination')
        
        root = `${root}/uploaded/${req.body.name}/`
        console.log(`creating dir ${root}`)
        shell.mkdir('-p', root)
        cb(null, root)
      },
      
      filename: function (req, file, cb) {
        //let ext=path.parse(file.originalname).ext;
        // Mimetype stores the file type, set extensions according to filetype
        //let name = path.parse(file.originalname).name
  
        cb(null, file.originalname );
      }
    });

    const upload = multer({storage: storage});
  
    app.post('/uploadHandler', upload.single('file'), function (req, res, next) {
      if (req.file && req.file.originalname) {
        console.log(`Received file ${req.file.originalname}`);
        console.log('Received data', req.body);
      }
      res.send({ responseText: req.file.path }); // You can send any response to the user here
      var key = 'ft.upload.'+req.body.token
      var data = JSON.stringify({filename : req.file.originalname, name: req.body.name, path:`${app.get('destination')}/uploaded/${req.body.name}/`})
      var obj = { token: req.body.token, id : req.body.token, key : 'ft.upload.'+req.body.token, data : data }
      redisOut.hmset(key, obj)
      redisPub.publish(key,key)
    });
    app.post('/getstatus', function (req, res, next) {
        if (req.file && req.file.originalname) {
          console.log(`Received file ${req.file.originalname}`);
        }
    
        res.send({ responseText: "file Import in progress :" + req.file.path }); // You can send any response to the user here
      });

    
  }