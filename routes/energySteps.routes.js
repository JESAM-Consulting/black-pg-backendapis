const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth")

const {
  createEnergy, getEnergy, updateEnergy, deleteEnergy,
} = require("../controllers/energySteps.controller");

router.get("/get-energy-steps", getEnergy);
router.post("/create-energy-steps", createEnergy);
router.put("/update-energy-steps", updateEnergy);
router.delete("/delete-energy-steps", deleteEnergy);

module.exports = router;
