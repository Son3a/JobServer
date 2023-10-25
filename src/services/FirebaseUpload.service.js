const multer = require('multer');
const path = require('path')
const { initializeApp } = require('firebase/app')
const { getStorage, getDownloadURL, ref, uploadBytesResumable } = require('firebase/storage')

initializeApp({
    apiKey: "AIzaSyCfSDh0mC62sG1GYOs8ppdW2BJjF5aRn_o",
    authDomain: "soajob-7fdb0.firebaseapp.com",
    projectId: "soajob-7fdb0",
    storageBucket: "soajob-7fdb0.appspot.com",
    messagingSenderId: "70518289693",
    appId: "1:70518289693:web:d2c9a53417c1d2ab155df4",
    measurementId: "G-EWV5HT7RRX"
})
const storage = getStorage();
const upload = multer({ storage: multer.memoryStorage() })
module.exports = {
    fireBaseAvatarUpload: async (req, res, next) => {
        try {
            const dateTime = new Date().getTime();
            const storageRef = ref(storage, `avatar/${req.file.originalname + "       " + dateTime.toString()}`);
            // Create file metadata including the content type
            const metadata = {
                contentType: req.file.mimetype,
            };
            // Upload the file in the bucket storage
            const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);
            //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel
            // Grab the public url
            const downloadURL = await getDownloadURL(snapshot.ref);
            console.log('File successfully uploaded.');
            // return res.send({
            //     message: 'file uploaded to firebase storage',
            //     name: req.file.originalname,
            //     type: req.file.mimetype,
            //     downloadURL: downloadURL
            // })
            req.file.fileUrl = downloadURL
            next();
        } catch (error) {
            return res.status(400).send(error.message)
        }
    },
    fireBaseCvUpload: async (req, res, next) => {
        try {
            const dateTime = new Date().getTime();
            const storageRef = ref(storage, `cv/${req.file.originalname + "       " + dateTime.toString()}`);
            // Create file metadata including the content type
            const metadata = {
                contentType: req.file.mimetype,
            };
            // Upload the file in the bucket storage
            const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);
            //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel
            // Grab the public url
            const downloadURL = await getDownloadURL(snapshot.ref);
            console.log('File successfully uploaded.');
            // return res.send({
            //     message: 'file uploaded to firebase storage',
            //     name: req.file.originalname,
            //     type: req.file.mimetype,
            //     downloadURL: downloadURL
            // })
            req.file.fileUrl = downloadURL
            next();
        } catch (error) {
            return res.status(400).send(error.message)
        }
    },
    upload: upload
};


