const { Schema, model } = require("mongoose");

const energySchema = new Schema(
    {
        project: { type: String },
        firstName: { type: String },
        lastName: { type: String },
        postalCode: { type: String },
        email: { type: String },
        phone: { type: String },
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
        isActive: {
            type: Boolean, default: true
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

let mutualzModel = model("energy-contact", energySchema, "energy-contact");
module.exports = mutualzModel;
