const enums = require("../json/enums.json")
const message = require("../json/message.json")
const contactFormModel = require("../models/contact")
const jwt = require('jsonwebtoken')
const ObjectId = require("mongoose").Types.ObjectId

const createForm = {

    handler: async (req, res) => {
        try {

            const createUserForm = new contactFormModel(req.body)
            await createUserForm.save()

            return res
                .status(enums.HTTP_CODES.OK)
                .send({ message: message.DATA_CREATED, data: createUserForm })

        } catch (err) {
            return res
                .status(enums.HTTP_CODES.BAD_REQUEST)
                .send({ message: message.GENERAL, data: err.message })
        }
    }
}

const getUserForm = {
    handler: async (req, res) => {
        try {
            const { id, project } = req.query

            let criteria = {}
            if (id) criteria._id = id
            if (project) criteria.project = project

            const page = parseInt(req.query.page) || 1
            const limit = parseInt(req.query.limit) || 10

            const countDoc = await contactFormModel.find(criteria).countDocuments()
            const findUserForm = await contactFormModel.find(criteria)
                .sort({ createdAt: -1 })
                .skip(limit * page - limit)
                .limit(limit)

            if (findUserForm) {
                return res
                    .status(enums.HTTP_CODES.OK)
                    .send({ message: message.DATA_FETCHED, data: findUserForm, count: countDoc })
            } else {
                return res.status(enums.HTTP_CODES.BAD_REQUEST).send({ message: message.DATA_NOT_FOUND })
            }
        } catch (error) {
            return res
                .status(enums.HTTP_CODES.BAD_REQUEST)
                .send({ message: message.GENERAL, data: err.message })
        }
    }
}

const updateUserForm = {
    handler: async (req, res) => {
        try {
            const { id } = req.query
            if (id) {
                const updateUserForm =
                    await contactFormModel.findByIdAndUpdate(id, req.body, { new: true })
                return res.status(enums.HTTP_CODES.OK).send({ message: message.DATA_UPDATED, data: updateUserForm })
            } else {
                return res.status(enums.HTTP_CODES.BAD_REQUEST).send({ message: message.DATA_NOT_FOUND })
            }
        } catch (error) {
            return res
                .status(enums.HTTP_CODES.BAD_REQUEST)
                .send({ message: message.GENERAL, data: err.message })
        }
    }
}

const deleteUserForm = {
    handler: async (req, res) => {
        try {
            const { id, project } = req.query

            const deleteUserForm = await contactFormModel.findOneAndDelete({ $and: [{ _id: id }, { project: project }] })
            console.log("deleteUserForm", deleteUserForm)

            if (deleteUserForm) {
                return res.status(enums.HTTP_CODES.OK).send({ message: message.DATA_DELETED, data: {} })
            } else {
                return res.status(enums.HTTP_CODES.BAD_REQUEST).send({ message: message.DATA_NOT_FOUND })
            }

        } catch (error) {
            return res
                .status(enums.HTTP_CODES.BAD_REQUEST)
                .send({ message: message.GENERAL, data: error.message })
        }
    }
}

module.exports = {
    createForm,
    getUserForm,
    updateUserForm,
    deleteUserForm
}