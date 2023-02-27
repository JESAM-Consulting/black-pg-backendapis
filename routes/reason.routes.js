const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth")

const {
  createReason,
  getReason,
  updateReason,
  deleteReason,
} = require("../controllers/reason.controller");

router.get("/get-reason", auth, getReason);
router.post("/create-reason", createReason);
router.put("/update-reason", auth, updateReason);
router.delete("/delete-reason", auth, deleteReason);

module.exports = router;
