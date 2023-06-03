const mongoose = require("mongoose")

const conn = mongoose.connection

// Creating GridFs Stream for file queries and MongoDB bucket for file streaming. //
conn.once("open", () => {
    gridBucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: "profile-pics",
    })
    attachment = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: "attachment",
    })
})

// Add file to database. //
async function addProfilePic(req, res) {
    try {
        await gridBucket.find({ filename: req.file.filename, _id: { $ne: req.file.id } }).forEach(file => gridBucket.delete(file._id))

        res.status(200).json({
            message: "Profile picture uploaded successfully",
            isSuccess: true,
            isError: false,
        })
    } catch (error) {
        console.log(error.message)

        res.status(500).json({
            message: "server error",
            isSuccess: false,
            isError: true,
        })
    }
}

async function getProfilePic(req, res) {
    try {
        const files = await gridBucket.find({ filename: `profilepic-${req.params.id}` }).toArray()

        if (files.length === 1) {
            files.forEach(file => gridBucket.openDownloadStream(file._id).pipe(res))
        } else {
            res.status(404).json({
                message: "file not found/ file doesn't exist",
                isSuccess: false,
                isError: true,
            })
        }

    } catch (error) {
        console.log(error.message)

        res.status(500).json({
            message: "server error",
            isError: true,
            isSuccess: false,
        })
    }
}

module.exports = {
    addProfilePic,
    getProfilePic,
}