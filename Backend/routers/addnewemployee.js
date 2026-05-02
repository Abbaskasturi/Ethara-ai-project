const express = require("express"); 
const router = express.Router()
const { addnewemployeeintoproject } = require("../controllers/adminlogincontroller")
const middleguard = require("../middleware/authecation")
console.log("TYPE addnewemployee:", typeof addnewemployeeintoproject);
console.log("TYPE middleguard:", typeof middleguard);
router.post("/addemp", middleguard, addnewemployeeintoproject)
module.exports = router; 