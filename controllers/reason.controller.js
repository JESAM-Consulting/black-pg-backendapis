const enums = require("../json/enums.json");
const message = require("../json/message.json");
const reasonModel = require("../models/reason.model");

/* APIS For Reason */
module.exports = exports = {
  /* Create Reason API */
  createReason: async (req, res) => {
    try {
      let { edit, money, telephone, like, calander, angry, fieldName } = req.body;

      edit ? (fieldName = "edit") : "",
        money ? (fieldName = "money") : "",
        telephone ? (fieldName = "telephone") : "",
        like ? (fieldName = "like") : "",
        calander ? (fieldName = "calander") : "",
        angry ? (fieldName = "angry") : "";

      req.body.fieldName = fieldName;

      const reason = await reasonModel.create(req.body);

      return res
        .status(enums.HTTP_CODES.OK)
        .send({ message: message.REASON_CREATED, data: reason });
    } catch (error) {
      console.log("Error in createReason: ", error);
      return res
        .status(enums.HTTP_CODES.BAD_REQUEST)
        .send({ message: message.GENERAL, data: error.message });
    }
  },

  /* Get Reason API */
  getReason: async (req, res) => {
    try {
      req.query =
        req.query.isAll === "true"
          ? { ...req.query }
          : { isActive: true, ...req.query };
      req.query.page = parseInt(req.query.page) || 1;
      req.query.limit = parseInt(req.query.limit) || 100;
      req.query.sortBy = req.query.sortBy || "createdAt";
      req.query.sortOrder = req.query.sortOrder || "desc";
      req.query.search
        ? (req.query = {
          $or: [{ fullName: { $regex: req.query.search, $options: "i" } }],
        })
        : "";

      const reasons = await reasonModel
        .find(req.query)
        .skip((req.query.page - 1) * req.query.limit)
        .limit(req.query.limit)
        .sort({ [req.query.sortBy]: req.query.sortOrder });

      return res
        .status(enums.HTTP_CODES.OK)
        .send({
          message: message.REASON_FETCHED,
          data: reasons,
          count: await reasonModel.countDocuments(req.query),
        });
    } catch (error) {
      console.log("Error in getReason: ", error);
      return res
        .status(enums.HTTP_CODES.BAD_REQUEST)
        .send({ message: message.GENERAL, data: error.message });
    }
  },

  /* Update Reason API*/
  updateReason: async (req, res) => {
    try {
      if (
        !(await reasonModel.findOne({
          _id: req.query.reasonId,
          isActive: true,
        }))
      )
        return res
          .status(enums.HTTP_CODES.NOT_FOUND)
          .send({ message: message.REASON_NOT_FOUND });

      await reasonModel.findByIdAndUpdate(req.query.reasonId, req.body, {
        new: true,
      });

      return res
        .status(enums.HTTP_CODES.OK)
        .send({ message: message.REASON_UPDATED });
    } catch (error) {
      console.log("Error in updateReason: ", error);
      return res
        .status(enums.HTTP_CODES.BAD_REQUEST)
        .send({ message: message.GENERAL, data: error.message });
    }
  },

  /* Delete Reason API*/
  deleteReason: async (req, res) => {
    try {
      if (
        !(await reasonModel.findOne({
          _id: req.query.reasonId,
          isActive: true,
        }))
      )
        return res
          .status(enums.HTTP_CODES.NOT_FOUND)
          .send({ message: message.REASON_NOT_FOUND });

      await reasonModel.findByIdAndUpdate(req.query.reasonId, {
        isActive: false,
      });

      return res
        .status(enums.HTTP_CODES.OK)
        .send({ message: message.REASON_DELETED });
    } catch (error) {
      console.log("Error in deleteReason: ", error);
      return res
        .status(enums.HTTP_CODES.BAD_REQUEST)
        .send({ message: message.GENERAL, data: error.message });
    }
  },
};
