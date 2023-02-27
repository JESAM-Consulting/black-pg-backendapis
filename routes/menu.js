const express = require("express")
const router = express.Router()
const menu = require("../controllers/menu")
const auth = require("../middlewares/auth")

const { localUpload } = require("../services/aws_image_upload/storeImages")

const uploadImage = localUpload.single("uploadExcel");

router.post("/bulk-write", auth, uploadImage, menu.bulkWrite)
router.get("/find", menu.getFileData)
router.put("/update", auth, menu.updateMutualz)
router.delete("/delete", auth, menu.deleteMutualz)

module.exports = router
