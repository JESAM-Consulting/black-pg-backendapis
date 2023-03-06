const express = require("express")
const router = express.Router()
const qualify = require("../controllers/qualify")
const auth = require("../middlewares/auth")

const { localUpload } = require("../services/aws_image_upload/storeImages")

const uploadImage = localUpload.single("uploadExcel");

router.post("/qualify/bulk-write", auth, uploadImage, qualify.bulkWrite)
router.post("/qualify/find", qualify.getFileData)
router.put("/qualify/update", auth, qualify.updateMutualz)
router.delete("/qualify/delete", auth, qualify.deleteMutualz)

module.exports = router
