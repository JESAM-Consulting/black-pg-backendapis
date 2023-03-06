const mongoose = require("mongoose");

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
        sms: { type: Boolean, default: false },
        contactedBy: { type: String, default: null },
        contactedOn: { type: Date, default: null },
        contactedAgain: { type: Date, default: null },
        lastContact: { type: Date, default: null },
        emailFailed: { type: Boolean, default: false },
        reached: { type: Boolean, default: false },
        appointmentDate: { type: Date, default: null },
        appointmentTime: { type: String, default: null },
        makeAppointment: { type: String, default: null },
        usefulInformation: { type: String, default: null },
        nichtGeeignet: { type: Boolean, default: false },
        pv: { type: Boolean, default: false },
    },
    { timestamps: true, versionKey: false, autoCreate: true }
);

// Export
module.exports = mongoose.model(
    "qualify",
    qualifySchema,
    "qualify"
);
