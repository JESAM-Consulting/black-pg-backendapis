require("dotenv").config()
const superAdminSchema = require("../models/admin")
const bcrypt = require("bcryptjs")
const enums = require("../json/enums.json")
const messages = require("../json/message.json")

const fs = require("fs")
const { ObjectId } = require("mongodb")

module.exports = {

    //superAdmin validation
    validateSuperAdmin: async (decoded) => {
        if (!decoded._id) {
            const message = {
                status: enums.HTTP_CODES.NOT_ACCEPTABLE,
                success: false,
                message: messages.SUPER_ADMIN_NOT_EXIST,
            }
            return {
                success: false,
                message: message,
            }
        }
        const superAdminData = await superAdminSchema.findOne({ _id: decoded._id })
        if (superAdminData === null) {
            const message = {
                status: enums.HTTP_CODES.NOT_ACCEPTABLE,
                success: false,
                message: messages.ADMIN_NOT_FOUND,
            }
            return {
                success: false,
                message: message,
            }
        }
        return {
            success: true,
            data: superAdminData,
        }
    },


    //validation for empty fields or expressions for more than one data
    validateFields: (payloadData, fields) => {
        let data4message = "please enter ";
        let array4fields = Object.keys(payloadData);
        let invalidFields = new Set();

        fields.forEach((field) => {
            if (!array4fields.includes(field)) {
                invalidFields.add(field);
            }
        });

        for (const key in payloadData) {
            if (fields.includes(key) && payloadData[key] === "") {
                invalidFields.add(key);
            }
        }
        if (invalidFields.size) {
            const array = Array.from(invalidFields);
            return data4message + array.join(", ");
        } else {
            return null;
        }
    },

    checkBooleanData: (data) => {
        if (data == null) {
            data4message = "boolean type must not be null"
            return data4message
        }
    },

    //checking password valid or not
    passwordExpression: (data4password) => {
        const passwordExpression =
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
                data4password
            )
        if (passwordExpression) {
            return true;
        } else {
            return false
        }
    },
}

