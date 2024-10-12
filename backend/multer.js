import multer from 'multer';


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // create folder for each user seperately : TODO
    return cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix =`${ Date.now()} - ${file.originalname}`
    cb(null, uniqueSuffix)
  }
})

// use path in mongo
// array of files upload.array
export default upload = multer ({storage : storage})
