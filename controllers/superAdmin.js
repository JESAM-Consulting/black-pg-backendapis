const superAdmin = require("../models/admin")
const httpStatus = require("http-status")
const jwt = require("jsonwebtoken")
const enums = require("../json/enums.json")
const messages = require("../json/message.json")
const bcrypt = require("bcrypt")
const utils = require("../utils/utils")
const message = require("../json/message.json")

const createAdmin = async (req, res) => {
    try {

        const { adminEmail, adminContactNo, password } = req.body
        const validate = utils.validateFields(req.body, ["firstName", "lastName", "adminEmail", "adminContactNo", "password"])
        if (validate) return res.status(enums.HTTP_CODES.BAD_REQUEST).send({ message: message.DATA_NOT_FOUND, data: validate })

        const adminExists = await superAdmin.findOne({ $or: [{ adminEmail: adminEmail }, { adminContactNo: adminContactNo }] })
        if (adminExists) {
            return res.status(httpStatus.CONFLICT).send({
                message: "email or phone already exists",
            })
        }

        const hash_password = await bcrypt.hash(password, 10)
        const body = { ...req.body, password: hash_password }

        const create = await superAdmin.create(body)

        return res
            .status(enums.HTTP_CODES.OK)
            .send({ success: true, message: messages.OK, data: create })

    } catch (error) {
        console.log(error)
        return res.status(httpStatus.BAD_REQUEST).send(error.message)
    }
}

const adminLogin = async (req, res) => {
    try {
        const { adminEmail, password } = req.body

        const validate = utils.validateFields(req.body, ["adminEmail", "password"])
        if (validate) return res.status(enums.HTTP_CODES.BAD_REQUEST).send({ message: message.DATA_NOT_FOUND, data: validate })

        const findAdmin = await superAdmin.findOne({ adminEmail: adminEmail })
        if (!findAdmin) {
            return res
                .status(enums.HTTP_CODES.BAD_REQUEST)
                .send({ success: false, messages: messages.NOT_VALID_EMAIL })
        }

        // compare password with db
        const isMatch = await bcrypt.compare(password, findAdmin.password)
        if (!isMatch) {
            return res
                .status(enums.HTTP_CODES.BAD_REQUEST)
                .send({ success: false, messages: messages.INVALID_PASSWORD })
        }

        // user found - create JWT & return it!
        const data4token = {
            _id: findAdmin._id,
            firstName: findAdmin.firstName,
            lastName: findAdmin.lastName,
            adminEmail: findAdmin.adminEmail,
        }

        const token = jwt.sign(
            data4token,
            process.env.JWT_SECRET,
        )

        return res
            .status(enums.HTTP_CODES.OK)
            .send({ success: true, messages: messages.ADMIN_LOGIN, data: data4token, token: token })


    } catch (err) {
        console.log(err)
        return res.status(httpStatus.BAD_REQUEST).send(err.message)
    }
}

const resetPassword = async (req, res) => {
    const decode = req.user

    const superAdminData = await utils.validateSuperAdmin(decode)

    if (superAdminData.success === false) {
        return res.status(enums.HTTP_CODES.BAD_REQUEST).json({
            success: superAdminData.success,
            message: messages.ADMIN_NOT_FOUND,
        })
    }

    const { password, confirmPassword } = req.body;

    const validate = utils.validateFields(req.body, ["confirmPassword", "password"])
    if (validate) return res.status(enums.HTTP_CODES.BAD_REQUEST).send({ message: message.DATA_NOT_FOUND, data: validate })

    if (password === confirmPassword) {
        const hash_password = await bcrypt.hash(password, 10)
        await superAdmin.findOneAndUpdate(
            decode._id,
            { $set: { password: hash_password } },
            { new: true }
        )

        return res.status(enums.HTTP_CODES.OK).json({
            success: true,
            message: messages.PASSWORD_RESET
        })
    } else {
        return res.status(enums.HTTP_CODES.BAD_REQUEST).json({
            success: false,
            message: messages.PASSWORD_NOT_MATCH
        })
    }
}

module.exports = {
    createAdmin,
    adminLogin,
    resetPassword,
}
