
const express = require("express"); 
const router = express.Router()
const { projectstatus, fetchalltasks } = require("../controllers/addemployeescontroller")
const middleguard = require("../middleware/authecation")
router.put("/taskstatus",middleguard , projectstatus)
router.get('/fetchtasks', middleguard, fetchalltasks)
module.exports = router;