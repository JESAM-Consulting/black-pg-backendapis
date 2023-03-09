const mongoose = require("mongoose");
const { COLOR } = require("../json/enums.json")

// Create a schema for Database

const qualifySchema = new mongoose.Schema(
    {
        id: { type: String },
        createdTime: { type: String },
        adId: { type: String },
        adName: { type: String },
        adsetId: { type: String },
        adsetName: { type: String },
        campaignId: { type: String },
        campaignName: { type: String },
        formId: { type: String },
        formName: { type: String },
        isOrganic: { type: String },
        plateform: { type: String },
        isEmployed: { type: String },
        salesExperience: { type: String },
        answer: { type: String },
        fname: { type: String },
        lname: { type: String },
        email: { type: String },
        phone: { type: String },
        state: { type: String },
        sms: { type: Boolean, default: null },
        contactedBy: { type: String, default: null },
        contactedOn: { type: Date, default: null },
        contactedAgain: { type: Date, default: null },
        lastContact: { type: Date, default: null },
        emailFailed: { type: Boolean, default: null },
        reached: { type: Boolean, default: null },
        appointmentDate: { type: Date, default: null },
        appointmentTime: { type: String, default: null },
        makeAppointment: { type: String, default: null },
        usefulInformation: { type: String, default: null },
        nichtGeeignet: { type: Boolean, default: null },
        pv: { type: Boolean, default: null },
        color: { type: String, enum: { values: [...Object.values(COLOR)], message: "Invalid color" }, default: COLOR.RED },
        starterSeminar: { type: Boolean, default: false },
    },
    { timestamps: true, versionKey: false, autoCreate: true }
);

// Export
module.exports = mongoose.model(
    "qualify",
    qualifySchema,
    "qualify"
);
