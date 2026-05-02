const express = require("express"); 
const router = express.Router()
const { employeeslogin } = require("../controllers/addemployeescontroller")
router.post("/emplogin", employeeslogin)
module.exports = router; 