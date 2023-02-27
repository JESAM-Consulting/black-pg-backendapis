const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth")

const {
  createMutualz,
  getMutualz,
  updateMutualz,
  deleteMutualz,
} = require("../controllers/mutualz.controller");

router.get("/get-mutualz", auth, getMutualz);
router.post("/create-mutualz", createMutualz);
router.put("/update-mutualz", auth, updateMutualz);
router.delete("/delete-mutualz", auth, deleteMutualz);

module.exports = router;
