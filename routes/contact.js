const router = require("express").Router()
const contactForm = require("../controllers/contact")
// const { validate } = require('../middlewares/validate')
// const { auth } = require("../middlewares/auth")


router.post("/contact", contactForm.createForm.handler)
router.put("/update_contact", contactForm.updateUserForm.handler)
router.get("/qualified_contact", contactForm.getUserForm.handler)
router.delete("/delete_contact", contactForm.deleteUserForm.handler)

module.exports = router