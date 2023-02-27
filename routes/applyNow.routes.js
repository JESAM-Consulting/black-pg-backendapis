const router = require("express").Router()
const applyNow = require("../controllers/applyNow")


router.post("/applyNow", applyNow.createForm.handler)
router.get("/get_applyNow", applyNow.getUserForm.handler)
router.put("/update_applyNow", applyNow.updateUserForm.handler)
router.delete("/delete_applyNow", applyNow.deleteUserForm.handler)

module.exports = router