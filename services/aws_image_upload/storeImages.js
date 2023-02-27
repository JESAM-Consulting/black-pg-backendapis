const enums = require("../../json/enums.json");
const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
require("dotenv").config();


aws.config.update({
    secretAccessKey: process.env.SECRET_KEY,
    accessKeyId: process.env.ACCESSKEYID,
    region: process.env.REGION,
});

const s3 = new aws.S3();

const upload = multer({
    storage: multerS3({
        s3,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        bucket: process.env.BUCKET,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: async function (req, file, cb) {
            const userType = req.query || "default";
            const userId = req.query || "default";
            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
            cb(
                null,
                `fe-leads/${userType}/${userId}/` +
                file.fieldname +
                "-" +
                uniqueSuffix +
                "." +
                file.originalname.split(".")[file.originalname.split(".").length - 1]
            );
        },
    })
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
const localUpload = multer({ storage: storage })

const deleteImage = async function (req, res, next) {
    if (req.body.keys instanceof Array == false) {
        return res.status(enums.HTTP_CODES.FORBIDDEN).json({
            success: false,
            message: `${messages.TYPE_NOT_SUPPORTED}`,
        });
    }

    let array = req.body.keys;
    let imageNameArray = [];
    let url = "";
    for (let i = 0; i < array.length; i++) {
        url = array[i].split("/")[array[i].split("/").length - 1];
        imageNameArray.push(url);

        const s3 = new aws.S3();
        var params = {
            Bucket: process.env.BUCKET,
            Key: req.body.keys[i],
        };
        s3.getObject(params, (err) => {
            if (err) {
                const message = "File not found";
                const payload = {
                    success: false,
                    message: message,
                };
                req.user = payload;
                next();
            }
            s3.deleteObject(params, async function (err, data) {
                const message = "Files deleted";
                const payload = {
                    success: true,
                    data: message,
                };
                req.user = payload;
                next();
            });
        });
    }
};

const uploadCsvToS3 = (data, name) => {

    const params = {
        Bucket: process.env.BUCKET,
        Key: name,
        Body: data,
    };

    return new Promise(async (resolve, reject) => {
        s3.upload(params, function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve({
                    upload_path: data.Location,
                });
            }
        });
    })

}
module.exports = { upload, localUpload, deleteImage, uploadCsvToS3 };
