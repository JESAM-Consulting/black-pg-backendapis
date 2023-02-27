const { Schema, model } = require("mongoose");

const reasonSchema = new Schema(
    {
        edit: { type: Boolean, default: false },
        money: { type: Boolean, default: false },
        telephone: { type: Boolean, default: false },
        like: { type: Boolean, default: false },
        calander: { type: Boolean, default: false },
        angry: { type: Boolean, default: false },
        fieldName: { type: String },
        salutation: { type: String },
        fullName: { type: String },
        email: { type: String },
        phone: { type: String },
        postalCode: { type: String },
        isActive: {
            type: Boolean, default: true
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

let reasonrModel = model("reason", reasonSchema, "reason");
module.exports = reasonrModel;
