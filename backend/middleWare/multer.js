const multerGridFs = require("multer-gridfs-storage")
const multer = require("multer")

//Get mongoDB URI. //
switch (process.env.NODE_ENV) {
    case "production":
        url = process.env.MONGO_ATLAS_URI
        break
    case "development":
        url = process.env.MONGO_LOCAL_URI
        break
    default:
        console.log(`unknown Node Environment ${process.env.NODE_ENV}`)
}

//Creating gridFs Storage. //
const storage = new multerGridFs.GridFsStorage({
    url,
    file: (req, file) => {
        switch (file.fieldname) {
            case "profilepic":
                return {
                    filename: `profilepic-${req.payload._id}`,
                    bucketName: `files`,
                }
        }
    }
})

//Export multer file upload middleware. //
module.exports = multer({ storage })