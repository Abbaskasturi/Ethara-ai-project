const express = require("express"); 
const router = express.Router()
const { adminlogin } = require("../controllers/adminlogincontroller")
router.post("/adminlogin", adminlogin)
module.exports = router; 