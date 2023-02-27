const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth")

const {
  createEnergy, getEnergy, updateEnergy, deleteEnergy,
} = require("../controllers/energyContact.controller");

router.get("/get-energy-form", getEnergy);
router.post("/create-energy-form", createEnergy);
router.put("/update-energy-form", updateEnergy);
router.delete("/delete-energy-form", auth, deleteEnergy);

module.exports = router;
