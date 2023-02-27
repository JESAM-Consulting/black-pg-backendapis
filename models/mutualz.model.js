const { Schema, model } = require("mongoose");

const mutualzSchema = new Schema(
    {
        project: { type: String, default: "mutualz" },
        firstName: { type: String },
        lastName: { type: String },
        postalCode: { type: String },
        email: { type: String },
        isActive: {
            type: Boolean, default: true
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

let mutualzModel = model("mutualz", mutualzSchema, "mutualz");
module.exports = mutualzModel;
