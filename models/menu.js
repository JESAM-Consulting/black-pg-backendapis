const mongoose = require("mongoose");

// Create a schema for Database

const menuSchema = new mongoose.Schema(
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
        hast: { type: String },
        hastNo: { type: String },
        fname: { type: String },
        lname: { type: String },
        email: { type: String },
        phone: { type: String },
        bundesland: { type: String },
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
        nichtGeeignet: { type: Boolean, default: false },
        pv: { type: Boolean, default: false },
        uploadExcel: [{ type: String }],
    },
    { timestamps: true, versionKey: false, autoCreate: true }
);

// Export
module.exports = mongoose.model(
    "menu",
    menuSchema,
    "menu"
);
