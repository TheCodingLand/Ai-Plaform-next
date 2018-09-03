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
        
        root = `${root}/uploaded/${req.body.name}/${req.body.version}/`
        shell.mkdir('-p', root)
        cb(null, root)
      },
      
      filename: function (req, file, cb) {
        let ext=path.parse(file.originalname).ext;
        // Mimetype stores the file type, set extensions according to filetype
        //let name = path.parse(file.originalname).name
  
        cb(null, 'datafile.' + ext);
      }
    });
    const upload = multer({storage: storage});
  
    app.post('/uploadHandler', upload.single('file'), function (req, res, next) {
      if (req.file && req.file.originalname) {
        console.log(`Received file ${req.file.originalname}`);
        console.log('Received data', req.body);
      }
      res.send({ responseText: req.file.path }); // You can send any response to the user here
      var obj = {filename : req.file.originalname, token: req.body.token, id : req.body.token, key : 'ft.upload.'+req.body.token, name: req.body.name, path:`${app.get('destination')}/uploaded/${req.body.name}/` }
      redisOut.hmset('upload.'+obj.filename, obj)
      redisPub.publish('upload.'+obj.filename,'upload.'+obj.filename)
    });
    app.post('/getstatus', function (req, res, next) {
        if (req.file && req.file.originalname) {
          console.log(`Received file ${req.file.originalname}`);
        }
    
        res.send({ responseText: "file Import in progress :" + req.file.path }); // You can send any response to the user here
      });

    
  }