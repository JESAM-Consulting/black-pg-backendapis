const mongoose = require("mongoose")
const { PROJECT_NAME } = require("../json/enums.json")

const contactSchema = new mongoose.Schema(
    {
        project: { type: String },
        name: { type: String },
        eigentuemer: { type: String },
        name_komplett: { type: String },
        plz: { type: String },
        telefon: { type: String },
        email: { type: String },
        stromverbrauch: { type: String },
        interesse_finanzierung: { type: String },
        dachform: { type: String },
        art_heizung: { type: String },
        leadherkunft: { type: String },
        ekd_vertriebler_id: { type: String },
        Bemerkungen: { type: String },
    },
    {
        timestamps: true,
        versionKey: false,
        autoCreate: true
    }
)

module.exports = roleModel = mongoose.model("contact", contactSchema, "contact")