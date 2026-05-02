const express = require("express"); 
const router = express.Router()
const { addemployee } = require("../controllers/addemployeescontroller")
const middleguard = require("../middleware/authecation")
router.post("/addemployees", middleguard,  addemployee)
module.exports = router; 