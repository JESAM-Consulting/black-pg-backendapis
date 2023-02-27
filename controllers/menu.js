const menuModel = require("../models/menu");
const messages = require("../json/message.json");
const apiResponse = require("../utils/utils");
const csv = require('csvtojson');
const fs = require('fs');
const { USER_TYPE } = require("../json/enums.json");

//create role
module.exports = {
    bulkWrite: async (req, res) => {
        try {
            if (req.user.adminEmail !== USER_TYPE.JESAM)
                return res
                    .status(401)
                    .send({ message: messages.UNAUTHORIZED });

            if (!req.file?.path) return res
                .status(400)
                .send({ message: messages.NOT_FOUND });

            csv()
                .fromFile(req.file.path)
                .then((jsonObj) => {
                    let i = Object.keys(jsonObj[0])
                    let validateKeys = [
                        'id',
                        'created_time',
                        'ad_id',
                        'ad_name',
                        'adset_id',
                        'adset_name',
                        'campaign_id',
                        'campaign_name',
                        'form_id',
                        'form_name',
                        'is_organic',
                        'platform',
                        'hast_du_bereits_vertriebserfahrung?',
                        'wann_könntest_du_starten?',
                        'vorname',
                        'nachname',
                        'telefonnummer',
                        'e-mail-adresse',
                        'bundesland'
                    ]
                    if (!i.every((v, i) => v === validateKeys[i])) {
                        for (let j = 0; j < i.length; j++) {
                            if (i[j] !== validateKeys[j]) {
                                console.log(123);
                                return res.status(400).json({ message: messages.invalidFileFormat + i[j] })
                            }
                        }
                    }
                    Promise.all(jsonObj.map(async (x) => {

                        await menuModel.insertMany([
                            {
                                id: x['id'],
                                createdTime: x['created_time'],
                                adId: x['ad_id'],
                                adName: x['ad_name'],
                                adsetId: x['adset_id'],
                                adsetName: x['adset_name'],
                                campaignId: x['campaign_id'],
                                campaignName: x['campaign_name'],
                                formId: x['form_id'],
                                formName: x['form_name'],
                                isOrganic: x['is_organic'],
                                plateform: x['plateform'],
                                hast: x['hast_du_bereits_vertriebserfahrung?'],
                                hastNo: x['wann_könntest_du_starten?'],
                                fname: x['vorname'],
                                lname: x['nachname'],
                                email: x['e-mail-adresse'],
                                phone: x['telefonnummer'],
                                bundesland: x['bundesland'],
                            }
                        ])
                    })).then(() => {
                        fs.unlinkSync(req.file.path, (err) => {
                            if (err) {
                                console.log("err", err)
                                return res.status(400).json({ message: err.message })
                            }
                        })
                        console.log("File deleted!")
                    })
                    return res
                        .status(200)
                        .send({ message: messages.INSERTED, });
                })

        } catch (error) {
            console.log("err", error)
            return res
                .status(500)
                .send({ message: messages.GENERAL });
        }
    },

    getFileData: async (req, res) => {
        try {
            let { id, page, limit, search } = req.query;
            page = parseInt(page) || 1;
            limit = parseInt(limit) || 10;

            let criteria = {}
            let searchData = {}
            if (id) criteria._id = id;

            if (search) {
                searchData = {
                    $or: [
                        { fname: { $regex: search, $options: "i" } },
                        { lname: { $regex: search, $options: "i" } },
                        { email: { $regex: search, $options: "i" } },
                        { phone: { $regex: search, $options: "i" } },
                    ]
                }
            }

            criteria = { ...criteria, ...searchData };


            let data = await menuModel
                .find(criteria)
                .skip((page - 1) * limit)
                .limit(limit)
                .sort({ createdAt: -1 });

            let total = await menuModel.countDocuments(criteria);

            return res
                .status(200)
                .send({ message: messages.SUCCESS, data, total });

        } catch (error) {
            console.log("err", error)
            return res
                .status(500)
                .send({ message: messages.GENERAL });
        }
    },

    /* Update Menu API*/
    updateMutualz: async (req, res) => {
        try {
            if (req.user.adminEmail === USER_TYPE.ADMIN || req.user.adminEmail === USER_TYPE.USER)
                return res
                    .status(401)
                    .send({ message: messages.UNAUTHORIZED });

            let { id } = req.query;
            if (!(await menuModel.findById(id)))
                return res
                    .status(404)
                    .send({ message: messages.DATA_NOT_FOUND });

            //getting data from body
            let { contactedOn, contactedAgain, lastContact, appointmentDate } = req.body;

            if (contactedOn) contactedOn = new Date(contactedOn) || existJobApplication.contactedOn
            if (contactedAgain) contactedAgain = new Date(contactedAgain) || existJobApplication.contactedAgain
            if (lastContact) lastContact = new Date(lastContact) || existJobApplication.lastContact
            if (appointmentDate) appointmentDate = new Date(appointmentDate) || existJobApplication.appointmentDate

            //body for updaetData
            let body = {
                $set: {
                    ...req.body,
                    contactedOn: contactedOn,
                    contactedAgain: contactedAgain,
                    lastContact: lastContact,
                    appointmentDate: appointmentDate,
                },
            };

            await menuModel.findByIdAndUpdate(id, body, { new: true });
            return res
                .status(200)
                .send({ message: messages.DATA_UPDATED });
        } catch (error) {
            console.log("Error in updateMutualz: ", error);
            return res
                .status(500)
                .send({ message: messages.GENERAL, data: error.message });
        }
    },

    /* Delete Menu API*/
    deleteMutualz: async (req, res) => {
        try {
            if (req.user.adminEmail !== USER_TYPE.JESAM)
                return res
                    .status(401)
                    .send({ message: messages.UNAUTHORIZED });

            let { id } = req.query;
            if (!(await menuModel.findById(id)))
                return res
                    .status(404)
                    .send({ message: messages.DATA_NOT_FOUND });

            await menuModel.findByIdAndDelete(id);

            return res
                .status(200)
                .send({ message: messages.DATA_DELETED });
        } catch (error) {
            console.log("Error in updateMutualz: ", error);
            return res
                .status(500)
                .send({ message: messages.GENERAL, data: error.message });
        }
    },
};
