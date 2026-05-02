const express = require("express"); 
const router = express.Router()
const { addnewemployeeintoproject, getallemployees,  allprojects } = require("../controllers/adminlogincontroller")
const middleguard = require("../middleware/authecation")
router.post("/addemp", middleguard, addnewemployeeintoproject)
router.get('/getallemp', middleguard, getallemployees)
router.get('/getallprojects', middleguard, allprojects)
module.exports = router; 