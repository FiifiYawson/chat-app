const multerGridFs = require("multer-gridfs-storage")
const multer = require("multer")
const uuid = require("uuid")

// Get mongoDB URI. //
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

// Creating gridFs Storage. //
const storage = new multerGridFs.GridFsStorage({
    url,
    file: (req, file) => {
        switch (file.fieldname) {
            case "profilepic":
                return {
                    filename: `profilepic-${req.userDetails._id}`,
                    bucketName: `profile-pics`,
                }
            case "attachment":
                return {
                    filename: `attachment-${req.userDetails._id}-${uuid.v4()}`,
                    bucketName: "attachment"
                }
        }
    },
})

// Export multer file upload middleware. //
module.exports = multer({
    storage,
    fileFilter: (req, file, cb) => {
        switch (file.fieldname) {
            case "profilepic":
                type = file.mimetype.split("/")[0]
                if (type !== "image") return cb("invalid file type", false)

                cb(null, true)
        }
    }
})