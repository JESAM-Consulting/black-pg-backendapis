const enums = require("../json/enums.json");
const message = require("../json/message.json");
const energyModel = require("../models/energySteps.model");
const { USER_TYPE } = require("../json/enums.json")


/* APIS For Reason */
module.exports = exports = {
  /* Create Reason API */
  createEnergy: async (req, res) => {
    try {
      const reason = await energyModel.create(req.body);

      return res
        .status(enums.HTTP_CODES.OK)
        .send({ message: message.ENERGY_STEPS_CREATED, data: reason });
    } catch (error) {
      console.log("Error in createEnergy: ", error);
      return res
        .status(enums.HTTP_CODES.BAD_REQUEST)
        .send({ message: message.GENERAL, data: error.message });
    }
  },

  /* Get Reason API */
  getEnergy: async (req, res) => {
    try {

      // if (req.user.adminEmail !== USER_TYPE.JESAM_ADMIN) {
      //   return res.status(enums.HTTP_CODES.UNAUTHORIZED).send({ message: message.UNAUTHORIZED });
      // }

      let { id, search, startDate, endDate, project } = req.query;

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      let criteria = { isActive: true }
      let searchData = {}
      if (id) criteria._id = id
      if (project) criteria.project = project

      if (search) {
        searchData = {
          $or: [
            { firstName: { $regex: search, $options: "i" } },
            { lastName: { $regex: search, $options: "i" } },
            { postalCode: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ]
        };
      }

      if (startDate && endDate) {
        startDate = new Date(startDate)
        endDate = new Date(endDate).setHours(23, 59, 59)

        criteria.createdAt = { $gte: startDate, $lte: endDate }
      }

      criteria = { ...criteria, ...searchData }

      const reasons = await energyModel
        .find(criteria)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });

      return res
        .status(enums.HTTP_CODES.OK)
        .send({
          message: message.ENERGY_STEPS_FETCHED,
          data: reasons,
          count: await energyModel.countDocuments(criteria),
        });
    } catch (error) {
      console.log("Error in getEnergy: ", error);
      return res
        .status(enums.HTTP_CODES.BAD_REQUEST)
        .send({ message: message.GENERAL, data: error.message });
    }
  },

  /* Update Reason API*/
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
          .send({ message: message.ENERGY_STEPS_NOT_FOUND });

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
        .send({ message: message.ENERGY_STEPS_UPDATED, payload: {} });
    } catch (error) {
      console.log("Error in updateEnergy: ", error);
      return res
        .status(enums.HTTP_CODES.BAD_REQUEST)
        .send({ message: message.GENERAL, data: error.message });
    }
  },

  /* Delete Reason API*/
  deleteEnergy: async (req, res) => {
    try {
      if (
        !(await energyModel.findOne({
          _id: req.query.energyId,
          isActive: true,
        }))
      )
        return res
          .status(enums.HTTP_CODES.NOT_FOUND)
          .send({ message: message.ENERGY_STEPS_NOT_FOUND });

      await energyModel.findByIdAndDelete(req.query.energyId);

      return res
        .status(enums.HTTP_CODES.OK)
        .send({ message: message.ENERGY_STEPS_DELETED, payload: {} });
    } catch (error) {
      console.log("Error in deleteEnergy: ", error);
      return res
        .status(enums.HTTP_CODES.BAD_REQUEST)
        .send({ message: message.GENERAL, data: error.message });
    }
  },
};
