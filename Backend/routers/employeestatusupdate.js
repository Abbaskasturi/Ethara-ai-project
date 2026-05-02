
const express = require("express"); 
const router = express.Router()
const { projectstatus } = require("../controllers/addemployeescontroller")
const middleguard = require("../middleware/authecation")
router.put("/taskstatus",middleguard , projectstatus)

module.exports = router;