const express = require("express"); 
const router = express.Router()
const { deleteemployee } = require("../controllers/adminlogincontroller")
const middleguard = require("../middleware/authecation")
router.patch("/deleteemp", middleguard, deleteemployee)
module.exports = router; 