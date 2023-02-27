const enums = require("../json/enums.json");
const message = require("../json/message.json");
const energyModel = require("../models/energyContact.model");
const { USER_TYPE } = require("../json/enums.json")

/* APIS For Energy */
module.exports = exports = {
  /* Create Energy API */
  createEnergy: async (req, res) => {
    try {
      const reason = await energyModel.create(req.body);

      return res
        .status(enums.HTTP_CODES.OK)
        .send({ message: message.ENERGY_CONTACT_CREATED, data: reason });
    } catch (error) {
      console.log("Error in createEnergy: ", error);
      return res
        .status(enums.HTTP_CODES.BAD_REQUEST)
        .send({ message: message.GENERAL, data: error.message });
    }
  },

  /* Get Energy API */
  getEnergy: async (req, res) => {
    try {

      // if (req.user.adminEmail !== USER_TYPE.JESAM_ADMIN) {
      //   return res.status(enums.HTTP_CODES.UNAUTHORIZED).send({ message: message.UNAUTHORIZED });
      // }

      req.query = req.query.isAll === "true" ? { ...req.query } : { isActive: true, ...req.query }; req.query.page = parseInt(req.query.page) || 1;

      req.query.limit = parseInt(req.query.limit) || 100;
      req.query.sortBy = req.query.sortBy || "createdAt";
      req.query.sortOrder = req.query.sortOrder || "desc";

      req.query.search
        ? (req.query = {
          $or: [
            { firstName: { $regex: req.query.search, $options: "i" } },
            { lastName: { $regex: req.query.search, $options: "i" } },
            { postalCode: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        })
        : "";

      const reasons = await energyModel
        .find(req.query)
        .skip((req.query.page - 1) * req.query.limit)
        .limit(req.query.limit)
        .sort({ [req.query.sortBy]: req.query.sortOrder });

      return res
        .status(enums.HTTP_CODES.OK)
        .send({
          message: message.ENERGY_CONTACT_FETCHED,
          data: reasons,
          count: await energyModel.countDocuments(req.query),
        });
    } catch (error) {
      console.log("Error in getEnergy: ", error);
      return res
        .status(enums.HTTP_CODES.BAD_REQUEST)
        .send({ message: message.GENERAL, data: error.message });
    }
  },

  /* Update Energy API*/
  updateEnergy: async (req, res) => {
    try {
      if (
        !(await energyModel.findOne({
          _id: req.query.energyId,
          isActive: true,
        }))
      )
        return res
          .status(enums.HTTP_CODES.NOT_FOUND)
          .send({ message: message.ENERGY_CONTACT_NOT_FOUND });

      //getting data from body
      let { contactedOn, contactedAgain, lastContact, appointmentDate } = req.body;

      if (contactedOn) contactedOn = new Date(contactedOn) || existJobApplication.contactedOn
      if (contactedAgain) contactedAgain = new Date(contactedAgain) || existJobApplication.contactedAgain
      if (lastContact) lastContact = new Date(lastContact) || existJobApplication.lastContact
      if (appointmentDate) appointmentDate = new Date(appointmentDate) || existJobApplication.appointmentDate

      //body for updaetData
      let data = {
        $set: {
          ...req.body,
          contactedOn: contactedOn,
          contactedAgain: contactedAgain,
          lastContact: lastContact,
          appointmentDate: appointmentDate,
        },
      };

      await energyModel.findByIdAndUpdate(req.query.energyId, data, { new: true });

      return res
        .status(enums.HTTP_CODES.OK)
        .send({ message: message.ENERGY_CONTACT_UPDATED, payload: {} });
    } catch (error) {
      console.log("Error in updateEnergy: ", error);
      return res
        .status(enums.HTTP_CODES.BAD_REQUEST)
        .send({ message: message.GENERAL, data: error.message });
    }
  },

  /* Delete Energy API*/
  deleteEnergy: async (req, res) => {
    try {

      if (req.user.adminEmail !== USER_TYPE.JESAM) {
        return res.status(enums.HTTP_CODES.UNAUTHORIZED).send({ message: message.UNAUTHORIZED });
      }

      let energyExists = await energyModel.findOne({ _id: req.query.energyId });

      if (energyExists.isActive) {
        await energyModel.findByIdAndUpdate(req.query.energyId, { isActive: false, });
      } else {
        await energyModel.findByIdAndUpdate(req.query.energyId, { isActive: true });
      }

      return res
        .status(enums.HTTP_CODES.OK)
        .send({ message: message.ENERGY_CONTACT_DELETED, payload: {} });
    } catch (error) {
      console.log("Error in deleteEnergy: ", error);
      return res
        .status(enums.HTTP_CODES.BAD_REQUEST)
        .send({ message: message.GENERAL, data: error.message });
    }
  },
};
