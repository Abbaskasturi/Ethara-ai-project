const express = require("express"); 
const router = express.Router()
const { employeeupdation } = require("../controllers/adminlogincontroller")
const middleguard = require("../middleware/authecation")
router.put("/empupdate", middleguard, employeeupdation)
module.exports = router; 