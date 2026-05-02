const express = require("express"); 
const router = express.Router()
const { addemployee, fetchalltasks } = require("../controllers/addemployeescontroller")
const middleguard = require("../middleware/authecation")
router.post("/addemployees", middleguard,  addemployee)
router.get('/fetchtasks', middleguard, fetchalltasks)
module.exports = router; 