const express = require("express"); 
const router = express.Router()
const { adminassigntasks } = require("../controllers/adminlogincontroller")
const middleguard = require("../middleware/authecation")
router.post("/admintasks", middleguard, adminassigntasks)
module.exports = router; 