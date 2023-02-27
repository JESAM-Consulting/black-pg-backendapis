const mongoose = require("mongoose");

//Define a schema
const SuperAdminSchema = new mongoose.Schema(
    {
        firstName: { type: String },
        lastName: { type: String },
        adminEmail: { type: String, required: true, unique: true },
        adminContactNo: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        confirmPassword: { type: String },
        isActive: { type: Boolean, default: true }
    },
    { versionKey: false, timestamps: true }
);

// const Admin = mongoose.models.admin || mongoose.model( "admin", SuperAdminSchema );
// module.exports = Admin;

module.exports = superAdmin = mongoose.model(
    "superAdmin",
    SuperAdminSchema,
    "superAdmin"
);

