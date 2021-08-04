const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'public/images')
    },
    filename: (req, file, callback) => {
        callback(null, `${Date.now().toString()}-${file.originalname}`)
    }
})

const fileFilter = (req, file, callback) => {
    const filter = ["image/png", "image/jpg", "image/jpeg"].find(image => image == file.mimetype)

    if(filter) return callback(null, true)
    
    else return callback(null, false)
}


module.exports = multer({
    storage,
    fileFilter
})