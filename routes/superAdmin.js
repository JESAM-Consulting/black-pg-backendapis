const express = require("express");
const superAdmin = require("../controllers/superAdmin");
const router = express.Router();
const auth = require("../middlewares/auth")


router.post("/create-admin", superAdmin.createAdmin)
router.post("/admin-login", superAdmin.adminLogin)
router.put("/password-reset", auth, superAdmin.resetPassword)

module.exports = router;
