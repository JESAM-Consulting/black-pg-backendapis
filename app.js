require('dotenv').config()
require("./db/connection")

const express = require("express")
const cors = require("cors")

const app = express()
const port = process.env.PORT || 3030

// define all route imports here
const contactForm = require("./routes/contact")
const superAdmin = require("./routes/superAdmin")
const reasonRoutes = require("./routes/reason.routes");
const mutualzRoutes = require("./routes/mutualz.routes");
const energyContact = require("./routes/energyContact.routes");
const energySteps = require("./routes/energySteps.routes");
const menu = require("./routes/menu");
const applyNowRoutes = require("./routes/applyNow.routes");
const qualify = require("./routes/qualify");


// define all routes here
app.use(cors({
    origin: "*"
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/FE_API/lead_api/v1", contactForm)
app.use("/FE_API/lead_api/v1", superAdmin)
app.use("/FE_API/lead_api/v1", reasonRoutes);
app.use("/FE_API/lead_api/v1", mutualzRoutes);
app.use("/FE_API/lead_api/v1", energyContact);
app.use("/FE_API/lead_api/v1", energySteps);
app.use("/FE_API/lead_api/v1", menu);
app.use("/FE_API/lead_api/v1", applyNowRoutes);
app.use("/FE_API/lead_api/v1", qualify);



app.listen(port, () => console.log(`app is listning to port: ${port}!`))