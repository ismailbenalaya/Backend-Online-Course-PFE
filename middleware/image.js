const path = require('path');
const multer = require ('multer');
const { fileURLToPath } = require('url');
var storage = multer.diskStorage({
  destination : function (req,res,cb ){
    cb(null,'images/')
  },
  filename : function(req,file, cb){
    let ext = path.extname(file.originalname)
    cb(null,Date.now()+ext)

  }
});
var images = multer({
    storage : storage,
    fileFilter : function(req,res,callback){
        if(file.mimetype == 'image/png' || file.mimetype == 'image/jpg'){
            callback(null,true)


        }else{
            console.log('only jpg and png can upload')
            callback(null,false)
        }

    },
    limits  :{
        fileSize : 1024 * 1024 * 2
    }

})
module.exports = images;