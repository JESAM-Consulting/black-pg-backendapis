const enums = require("../json/enums.json")
const message = require("../json/message.json")
const applyNowModel = require("../models/applyNow")
const { validateFields } = require("../utils/utils")

const createForm = {

    handler: async (req, res) => {
        try {
            const validate = validateFields(req.body, ["project", "userName", "postalCode", "email", "phone", "isSales"])
            if (validate) return res.status(enums.HTTP_CODES.BAD_REQUEST).send({ message: message.DATA_NOT_FOUND, data: validate })

            if (req.body.isSales === true) {
                const validate = validateFields(req.body, ["workYears"])
                if (validate) return res.status(enums.HTTP_CODES.BAD_REQUEST).send({ message: message.DATA_NOT_FOUND, data: validate })
            }

            const createUserForm = new applyNowModel(req.body)
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

            const countDoc = await applyNowModel.find(criteria).countDocuments()
            const findUserForm = await applyNowModel.find(criteria)
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
            const updateUserForm = await applyNowModel.findByIdAndUpdate(id, req.body, { new: true })
            if (updateUserForm) {
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
            const { id } = req.query

            const deleteUserForm = await applyNowModel.findByIdAndDelete(id)

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