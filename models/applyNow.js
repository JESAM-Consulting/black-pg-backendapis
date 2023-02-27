const mongoose = require("mongoose")

const contactSchema = new mongoose.Schema(
    {
        project: { type: String, default: "apply now" },
        userName: { type: String },
        postalCode: { type: String },
        email: { type: String },
        phone: { type: String },
        isSales: { type: Boolean, default: false },
        workYears: { type: String },
    },
    {
        timestamps: true,
        versionKey: false,
        autoCreate: true
    }
)

module.exports = applyNowMOdel = mongoose.model("applyNow", contactSchema, "applyNow")