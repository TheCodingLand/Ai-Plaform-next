module.exports = (app) => {
    const multer = require('multer');
    const path = require('path');
    const storage = multer.diskStorage({
      destination: app.get('destination'),
      filename: function (req, file, cb) {
        let ext=path.parse(file.originalname).ext;
        // Mimetype stores the file type, set extensions according to filetype
        let name = path.parse(file.originalname).name
  
        cb(null, name + Date.now() + ext);
      }
    });
    const upload = multer({storage: storage});
  
    app.post('/uploadHandler', upload.single('file'), function (req, res, next) {
      if (req.file && req.file.originalname) {
        console.log(`Received file ${req.file.originalname}`);
      }
  
      res.send({ responseText: req.file.path }); // You can send any response to the user here
    });
    app.post('/getstatus', function (req, res, next) {
        if (req.file && req.file.originalname) {
          console.log(`Received file ${req.file.originalname}`);
        }
    
        res.send({ responseText: "file conversion in progress :" + req.file.path }); // You can send any response to the user here
      });

    
  }