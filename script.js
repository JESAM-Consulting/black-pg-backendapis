const handleStatusColor = async ({ data, models }) => {
    for await (let teamData of data) {
        await models.findOneAndUpdate({ _id: teamData._id }, { color: "red" }, { new: true });
        if (teamData.starterSeminar === true) {
            await models.findOneAndUpdate({ _id: teamData._id }, { color: "pink" }, { new: true })
        } else {
            if (
                (teamData?.nichtGeeignet === false || teamData?.nichtGeeignet === null) &&
                teamData?.emailFailed === null
            ) {
                if (
                    (!teamData.starterSeminar || teamData?.starterSeminar === false) &&
                    (!teamData.sms || teamData.sms === false) &&
                    !teamData?.contactedBy &&
                    (!teamData.contactedOn || teamData.contactedOn === "Invalid date") &&
                    (!teamData?.contactedAgain || teamData.contactedAgain === "Invalid date") &&
                    (!teamData?.lastContact || teamData?.lastContact === "Invalid date") &&
                    (!teamData?.reached || teamData?.reached === false) &&
                    !teamData?.makeAppointment &&
                    !teamData?.usefulInformation &&
                    (!teamData?.appointmentDate || teamData?.appointmentDate === "Invalid date") &&
                    !teamData?.appointmentTime
                ) {
                    console.log("first");
                    await models.findOneAndUpdate({ _id: teamData._id }, { color: "red" }, { new: true })
                } else {
                    if (
                        (teamData.appointmentDate && teamData.appointmentDate !== "Invalid date") ||
                        (teamData.appointmentTime && teamData.appointmentTime !== null)
                    ) {
                        console.log("second");
                        await models.findOneAndUpdate({ _id: teamData._id }, { color: "green" }, { new: true })
                    } else {
                        console.log("third");
                        await models.findOneAndUpdate({ _id: teamData._id }, { color: "orange" }, { new: true })
                    }
                }
            } else {
                if (
                    teamData.nichtGeeignet === true ||
                    teamData.emailFailed === true ||
                    teamData.emailFailed === null
                ) {
                    console.log("fifth");
                    await models.findOneAndUpdate({ _id: teamData._id }, { color: "black" }, { new: true })
                } else {
                    if (
                        (teamData.appointmentDate !== "Invalid date" &&
                            teamData?.appointmentDate?.length !== 0 &&
                            teamData?.appointmentDate !== null) ||
                        teamData?.appointmentTime
                    ) {
                        console.log("sixth");
                        await models.findOneAndUpdate({ _id: teamData._id }, { color: "green" }, { new: true })
                    } else {
                        if (
                            teamData.sms ||
                            teamData.contactedBy ||
                            (teamData.contactedOn !== "Invalid date" &&
                                teamData?.contactedOn?.length !== 0 &&
                                teamData?.contactedOn !== null) ||
                            (teamData.contactedAgain !== "Invalid date" &&
                                teamData?.contactedAgain?.length !== 0 &&
                                teamData?.contactedAgain !== null) ||
                            (teamData.lastContact !== "Invalid date" &&
                                teamData.lastContact?.length !== 0 &&
                                teamData.lastContact !== null) ||
                            teamData.reached ||
                            teamData.makeAppointment ||
                            teamData.usefulInformation
                        ) {
                            console.log("seventh");
                            await models.findOneAndUpdate({ _id: teamData._id }, { color: "orange" }, { new: true })
                        } else {
                            console.log("eigth");
                            await models.findOneAndUpdate({ _id: teamData._id }, { color: "red" }, { new: true })
                        }
                    }
                }
            }
        }
    }
};

module.exports = { handleStatusColor };