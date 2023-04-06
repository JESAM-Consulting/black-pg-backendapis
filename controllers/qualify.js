const qualifyModel = require("../models/qualify");
const messages = require("../json/message.json");
const csv = require('csvtojson');
const fs = require('fs');
const { USER_TYPE, COLOR } = require("../json/enums.json");
const { handleStatusColor } = require("../script");

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

            let results = [];
            csv().fromFile(req.file.path).then(async (jsonObj) => {
                for await (const i of jsonObj) {
                    const findExistPhone = await qualifyModel.findOne({ $or: [{ phone: i.phone }, { email: i.email }] });
                    if (!findExistPhone) {
                        results.push(i);
                    }

                    let fields = Object.keys(jsonObj[0])
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
                        'bist_du_bereit,_als_selbststÃ¤ndiger_energieberater_bei_der_energy_&_finance_durchzustarten_und_durchschnittlich_108000_euro_pro_jahr_zu_verdienen?',
                        'bist_du_derzeit_berufstÃ¤tig?',
                        'wie_viel_vertriebserfahrung_hast_du?',
                        'bist_du_in_besitz_eines_fÃ¼hrerscheins_(klasse_b)?',
                        'bitte_wÃ¤hle_die_auf_dich_zutreffende_antwort_aus:_ich_bin_',
                        'beschreibe_in_wenigen_sÃ¤tzen,_warum_du_energy_guide_der_energy_&_finance_werden_mÃ¶chtest.',
                        'first_name',
                        'last_name',
                        'phone_number',
                        'email',
                        'state']

                    const missingField = fields.find(item => !validateKeys.includes(item))
                    if (missingField) return apiResponse.BAD_REQUEST({ res, message: messages.INVALID_DATA + missingField });
                }

                let data = [];
                for (let i = 0; i < results.length; i++) {
                    let obj = {};
                    obj.id = results[i].id;
                    obj.createdTime = results[i].created_time;
                    obj.adId = results[i].ad_id;
                    obj.adName = results[i].ad_name;
                    obj.adsetId = results[i].adset_id;
                    obj.adsetName = results[i].adset_name;
                    obj.campaignId = results[i].campaign_id;
                    obj.campaignName = results[i].campaign_name;
                    obj.formId = results[i].form_id;
                    obj.formName = results[i].form_name;
                    obj.isOrganic = results[i].is_organic;
                    obj.plateform = results[i].platform;
                    obj.readyToEarn = results[i]['bist_du_bereit,_als_selbststÃ¤ndiger_energieberater_bei_der_energy_&_finance_durchzustarten_und_durchschnittlich_108000_euro_pro_jahr_zu_verdienen?']
                    obj.isEmployed = results[i]['bist_du_derzeit_berufstÃ¤tig?'];
                    obj.salesExperience = results[i]['wie_viel_vertriebserfahrung_hast_du?'];
                    obj.hasDrivingLicense = results[i]['bist_du_in_besitz_eines_fÃ¼hrerscheins_(klasse_b)?'];
                    obj.answer = results[i]['bitte_wähle_die_auf_dich_zutreffende_antwort_aus:_ich_bin_?'];
                    obj.description = results[i]['beschreibe_in_wenigen_sÃ¤tzen,_warum_du_energy_guide_der_energy_&_finance_werden_mÃ¶chtest.'];
                    obj.fname = results[i].first_name;
                    obj.lname = results[i].last_name;
                    obj.email = results[i].phone_number;
                    obj.phone = results[i].email;
                    obj.state = results[i].state;
                    data.push(obj);
                }
                await qualifyModel.insertMany(data);
                await fs.unlink(req.file.path, (err) => {
                    if (err) console.log(err);
                    return res.status(201).send({ message: messages.INSERTED })
                });
            });

        } catch (error) {
            console.log("err", error)
            return res
                .status(500)
                .send({ message: messages.GENERAL });
        }
    },

    getFileData: async (req, res) => {
        try {
            let { id, page, limit, sortBy, sortOrder, startDate, endDate, search, color } = req.body;
            page = parseInt(page) || 1;
            limit = parseInt(limit) || 100;
            sortBy = sortBy || "createdAt";
            sortOrder = sortOrder || -1;
            let criteria = {}
            let searchData = {}
            if (id) criteria._id = id;

            if (startDate && endDate) {
                startDate = new Date(startDate)
                endDate = new Date(endDate).setHours(23, 59, 59)

                criteria.createdAt = { $gte: startDate, $lte: endDate }
            }

            if (color) criteria.color = color;

            search ? searchData = {
                $or: [
                    { fname: { $regex: search, $options: "i" } },
                    { lname: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } },
                    { phone: { $regex: search, $options: "i" } },
                ]
            } : ""

            criteria = { ...criteria, ...searchData };

            let data = await qualifyModel
                .find(criteria)
                .skip((page - 1) * limit)
                .limit(limit)
                .sort({ [sortBy]: sortOrder })

            let total = await qualifyModel.countDocuments(criteria);

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
            if (!(await qualifyModel.findById(id)))
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

            let updateQualify = await qualifyModel.findByIdAndUpdate(id, body, { new: true });
            if (updateQualify) {
                await handleStatusColor({ data: [updateQualify], models: qualifyModel })
            }
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
            if (!(await qualifyModel.findById(id)))
                return res
                    .status(404)
                    .send({ message: messages.DATA_NOT_FOUND });

            await qualifyModel.findByIdAndDelete(id);

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
