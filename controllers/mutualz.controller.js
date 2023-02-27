const enums = require("../json/enums.json");
const message = require("../json/message.json");
const mutualzModel = require("../models/mutualz.model");

/* APIS For Reason */
module.exports = exports = {
  /* Create Reason API */
  createMutualz: async (req, res) => {
    try {
      const reason = await mutualzModel.create(req.body);

      return res
        .status(enums.HTTP_CODES.OK)
        .send({ message: message.MUTUALZ_CREATED, data: reason });
    } catch (error) {
      console.log("Error in createMutualz: ", error);
      return res
        .status(enums.HTTP_CODES.BAD_REQUEST)
        .send({ message: message.GENERAL, data: error.message });
    }
  },

  /* Get Reason API */
  getMutualz: async (req, res) => {
    try {
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

      const reasons = await mutualzModel
        .find(req.query)
        .skip((req.query.page - 1) * req.query.limit)
        .limit(req.query.limit)
        .sort({ [req.query.sortBy]: req.query.sortOrder });

      return res
        .status(enums.HTTP_CODES.OK)
        .send({
          message: message.MUTUALZ_FETCHED,
          data: reasons,
          count: await mutualzModel.countDocuments(req.query),
        });
    } catch (error) {
      console.log("Error in getMutualz: ", error);
      return res
        .status(enums.HTTP_CODES.BAD_REQUEST)
        .send({ message: message.GENERAL, data: error.message });
    }
  },

  /* Update Reason API*/
  updateMutualz: async (req, res) => {
    try {
      if (
        !(await mutualzModel.findOne({
          _id: req.query.mutualzId,
          isActive: true,
        }))
      )
        return res
          .status(enums.HTTP_CODES.NOT_FOUND)
          .send({ message: message.MUTUALZ_NOT_FOUND });

      await mutualzModel.findByIdAndUpdate(req.query.mutualzId, req.body, { new: true });

      return res
        .status(enums.HTTP_CODES.OK)
        .send({ message: message.MUTUALZ_UPDATED });
    } catch (error) {
      console.log("Error in updateMutualz: ", error);
      return res
        .status(enums.HTTP_CODES.BAD_REQUEST)
        .send({ message: message.GENERAL, data: error.message });
    }
  },

  /* Delete Reason API*/
  deleteMutualz: async (req, res) => {
    try {
      if (
        !(await mutualzModel.findOne({
          _id: req.query.mutualzId,
          isActive: true,
        }))
      )
        return res
          .status(enums.HTTP_CODES.NOT_FOUND)
          .send({ message: message.MUTUALZ_NOT_FOUND });

      await mutualzModel.findByIdAndUpdate(req.query.mutualzId, { isActive: false, });

      return res
        .status(enums.HTTP_CODES.OK)
        .send({ message: message.MUTUALZ_DELETED });
    } catch (error) {
      console.log("Error in deleteMutualz: ", error);
      return res
        .status(enums.HTTP_CODES.BAD_REQUEST)
        .send({ message: message.GENERAL, data: error.message });
    }
  },
};
