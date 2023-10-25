const multer = require('multer');
const path = require('path')
//cloudinary
const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')
//cloudinary config
cloudinary.config({
    cloud_name: 'dnshdled2',
    api_key: '278276873974371',
    api_secret: 'uA82HjnDFeTVYnLLtdshkwouFcE',
    secure: true
});
const cloudinaryStorageAvatar = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'job',
        format: async (req, file) => 'jpg'
    }
})
const cloudinaryStorageCV = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'job',
        format: async (req, file) => 'pdf'
    },
})
const cloudUploadAvatar = multer({ storage: cloudinaryStorageAvatar })

const cloudUploadCV = multer({ storage: cloudinaryStorageCV })

module.exports.cloudUpload = {
    cloudUploadAvatar: cloudUploadAvatar,
    cloudUploadCV: cloudUploadCV
};


