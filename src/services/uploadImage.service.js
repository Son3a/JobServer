const multer = require('multer');
const path = require('path')
const fs = require('fs')
//config khi luu anh. nếu muốn lưu ảnh ở directory khác thì tạo một config khác.
const imageStorage = multer.diskStorage({
    destination: ( req, file, cb ) => {
    const rootPathUploadDir = path.resolve('../upload/images' );
    if (!fs.existsSync(`${rootPathUploadDir}`)) {
      fs.mkdirSync(rootPathUploadDir, { recursive: true });
    }
    cb(null, rootPathUploadDir);
  },
  filename: ( req, file, cb ) => {
    console.log(file);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const cvStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "../upload/cv")
    },
    filename: (req, file, cb) => {
        if (file) {
            cb(null, Date.now() + path.extname(file.originalname))
        } 
    }
});

module.exports.upload = {
    Image: multer({ storage: imageStorage }),
    CV: multer({ storage: cvStorage })
};


