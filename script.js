// const models = require("./models/qualify");

// const handleStatusColor = async (x) => {

//     for await (let teamData of x) {
//         if (teamData.pv === true) {
//             await models.findOneAndUpdate({ _id: teamData._id }, { color: "pink" })
//             console.log("pink")
//         } else {
//             if (
//                 (teamData?.nichtGeeignet === false || teamData?.nichtGeeignet === null) &&
//                 teamData?.emailFailed === null
//             ) {

//                 if (
//                     !teamData.pv &&
//                     !teamData.sms &&
//                     !teamData?.contactedBy &&
//                     !teamData?.contactedOn &&
//                     !teamData?.contactedAgain &&
//                     !teamData?.lastContact &&
//                     !teamData?.reached &&
//                     !teamData?.makeAppointment &&
//                     !teamData?.usefulInformation &&
//                     !teamData?.appointmentDate &&
//                     !teamData?.appointmentTime
//                 ) {
//                     await models.findOneAndUpdate({ _id: teamData._id }, { color: "red" })
//                     console.log("red")
//                 } else {
//                     if (
//                         teamData.appointmentDate ||
//                         teamData.appointmentTime
//                     ) {
//                         await models.findOneAndUpdate({ _id: teamData._id }, { color: "green" })
//                         console.log("green")
//                     } else {
//                         await models.findOneAndUpdate({ _id: teamData._id }, { color: "orange" })
//                         console.log("black")
//                     }
//                 }
//             } else {
//                 if (
//                     teamData.nichtGeeignet === true ||
//                     teamData.emailFailed === true ||
//                     teamData.emailFailed === null
//                 ) {
//                     await models.findOneAndUpdate({ _id: teamData._id }, { color: "black" })
//                     console.log("black")
//                 } else {
//                     if (
//                         (teamData.appointmentDate !== "Invalid date" &&
//                             teamData?.appointmentDate?.length !== 0 &&
//                             teamData?.appointmentDate !== null) ||
//                         teamData?.appointmentTime
//                     ) {
//                         await models.findOneAndUpdate({ _id: teamData._id }, { color: "green" })
//                         console.log("green")
//                     } else {
//                         if (
//                             teamData.sms ||
//                             teamData.contactedBy ||
//                             (teamData.contactedOn !== "Invalid date" &&
//                                 teamData?.contactedOn?.length !== 0 &&
//                                 teamData?.contactedOn !== null) ||
//                             (teamData.contactedAgain !== "Invalid date" &&
//                                 teamData?.contactedAgain?.length !== 0 &&
//                                 teamData?.contactedAgain !== null) ||
//                             (teamData.lastContact !== "Invalid date" &&
//                                 teamData.lastContact?.length !== 0 &&
//                                 teamData.lastContact !== null) ||
//                             teamData.reached ||
//                             teamData.makeAppointment ||
//                             teamData.usefulInformation
//                         ) {
//                             await models.findOneAndUpdate({ _id: teamData._id }, { color: "orange" })
//                             console.log("orange")
//                         } else {
//                             await models.findOneAndUpdate({ _id: teamData._id }, { color: "red" })
//                             console.log("red")
//                         }
//                     }
//                 }
//             }
//         }
//     }

// };

// module.exports = { handleStatusColor };