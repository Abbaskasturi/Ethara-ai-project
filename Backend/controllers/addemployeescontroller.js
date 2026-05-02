const jwt = require("jsonwebtoken"); 
const addemployee = async (req,res) => {
    const {name,contact, empid,role} = req.body; 
    const db = req.app.locals.db; 
    const employees = await db.collection("employeescollection").findOne({
        empid: empid,   
    })
    if(employees) {
        return res.status(401).json({
            message: "same empid already exist" 
        })
    }
    await db.collection("employeescollection").insertOne({
        name: name,
        contact: contact, 
        empid: empid,
        role: role
    }); 
    res.status(200).json({
        message: "new employee successfully stored in db"
    })
}

const employeeslogin = async (req, res) => {
    const {name, empid} = req.body; 
    const db = req.app.locals.db; 
    const employees = await db.collection("employeescollection").findOne({
        empid: empid,   
    }); 
    if(!employees) {
        return res.status(401).json({
            message: "unauthorized empid"
        })
    }
    const payload = {
        name: name, 
        empid: empid,
    }
    const jwttoken = jwt.sign(payload, process.env.JWT_SECRETE_KEY, {expiresIn: "2h"}); 
    res.status(200).json({
        message: jwttoken
    })
}

const projectstatus = async (req, res) => {
    try {
        const { projectName, empid, status } = req.body;
        const db = req.app.locals.db;


        if (!projectName || !empid || !status) {
            return res.status(400).json({
                message: "projectName, empid and status are required"
            });
        }

        const result = await db.collection("projects").updateOne(
            { projectName, "tasks.empid": empid },
            {
                $set: {
                    "tasks.$.status": status
                }
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                message: "Project or employee not found"
            });
        }

        if (result.modifiedCount === 0) {
            return res.status(400).json({
                message: "Status not updated"
            });
        }

        res.status(200).json({
            message: "Status updated successfully"
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};

module.exports = {addemployee, employeeslogin, projectstatus}; 