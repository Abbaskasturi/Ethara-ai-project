const express = require("express"); 
const app = express();  
const cors = require("cors"); 
const dotenv = require("dotenv"); 
const bcrypt = require("bcrypt");  
app.use(express.json()); 
dotenv.config(); 
app.use(cors()); 
const adminlogin = require("./routers/adminroute"); 
const addemployee = require("./routers/addemployees"); 
const employeeslogins = require('./routers/employeelogin')
const admintaskassig = require('./routers/admintasks'); 
const deleteemployee = require('./routers/deleteemployee')
const employeeupdation =require('./routers/employeeupdate')
const newemployee = require('./routers/addnewemployee') 
const employeestatusupdate = require('./routers/employeestatusupdate')
const {MongoClient} = require("mongodb"); 
MongoClient.connect(process.env.MONGO_URL)
    .then(async (client) => {
        console.log("nodejs connected to mongodb"); 
        const db = client.db(process.env.DB_NAME); 
        app.locals.db = db; 
        const collections = await db.listCollections().toArray();
        const admincol = collections.some((each) => each.name === "admincollection"); 
        const adminhasedpass = await bcrypt.hash(process.env.admin_password, 5); 
        if(!admincol){
            await db.createCollection("admincollection") 
            await db.collection("admincollection").insertOne({
                email: "ethara.ai@gmail.com", 
                password: adminhasedpass
            })
            console.log("admin collection created");
        }else{
            console.log("admin collection created already") 
        }
        app.use('/auth', adminlogin); 
        app.use('/auth', addemployee); 
        app.use('/api', employeeslogins); 
        app.use('/api', employeestatusupdate)
        app.use('/auth', admintaskassig); 
        app.use('/auth', deleteemployee);
        app.use('/auth', employeeupdation); 
        app.use('/auth', newemployee); 
        app.listen(5000, () => {
            console.log("server running on the port http://localhost:5000"); 
        })
    }).catch((error) => {
        console.log(`getting errro ${error}`)
    })