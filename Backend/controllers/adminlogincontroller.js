const bcrypt = require("bcrypt"); 
const jwt = require("jsonwebtoken"); 

const adminlogin = async (req,res) => {
    try{
    const {email,password} = req.body; 
    const db = req.app.locals.db; 
    const useradmin = await db.collection("admincollection").findOne({
        email: email, 
    });  
    if(!useradmin){
        return res.status(401).json({ 
            message: "authorized admin"
        }); 
    } 
    const comPassword = await bcrypt.compare(password, useradmin.password); 
    if(comPassword){
        const payload={
            email: email
        }
        const jwttoken = jwt.sign(payload, process.env.JWT_SECRETE_KEY, {expiresIn: "2h"}); 
        res.status(200).json({
            message: jwttoken
        })
    }else{
        res.status(401).json({
            message: "incorrect password admin"
        })
    }
    }catch(err){
        res.status(401).json({
            message: "internal server errro"
        })
    }

} 

const adminassigntasks = async (req, res) => {
    try {
        const { projectName, name, empid, role, task, deadline } = req.body;
        const db = req.app.locals.db;

        if (!projectName || !name || !empid || !role || !task || !deadline) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const newTask = {
            name,
            empid,
            role,
            task,
            deadline,
            status: "pending",
            createdAt: new Date()
        };

       
        const result = await db.collection("projects").updateOne(
            { projectName: projectName },
            { $push: { tasks: newTask } }
        );

    
        if (result.matchedCount === 0) {
            await db.collection("projects").insertOne({
                projectName,
                createdAt: new Date(),
                tasks: [newTask]
            });

            return res.status(200).json({
                message: "Project created and task assigned",
                task: newTask
            });
        }

    
        res.status(200).json({
            message: "Task assigned successfully",
            task: newTask
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};

const deleteemployee = async (req, res) => {
    try {
        const { projectName, empid } = req.body;
        const db = req.app.locals.db;

        if (!projectName || !empid) {
            return res.status(400).json({
                message: "projectName and empid are required"
            });
        }

        const result = await db.collection("projects").updateOne(
            { projectName: projectName },
            {
                $pull: {
                    tasks: { empid: empid }  
                }
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        if (result.modifiedCount === 0) {
            return res.status(404).json({
                message: "Employee not found in this project"
            });
        }

        res.status(200).json({
            message: "Employee task removed successfully"
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};

const employeeupdation = async (req, res) => {
    try {
        const { projectName, empid, status, task, deadline, role } = req.body;
        const db = req.app.locals.db;

        if (!projectName || !empid) {
            return res.status(400).json({
                message: "projectName and empid are required"
            });
        }
        const updateFields = {};

        if (status !== undefined) updateFields["tasks.$.status"] = status;
        if (task !== undefined) updateFields["tasks.$.task"] = task;
        if (deadline !== undefined) updateFields["tasks.$.deadline"] = deadline;
        if (role !== undefined) updateFields["tasks.$.role"] = role;

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({
                message: "Provide at least one field: status, task, deadline, role"
            });
        }

        const result = await db.collection("projects").updateOne(
            { projectName, "tasks.empid": empid },
            { $set: updateFields }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                message: "Project or employee not found"
            });
        }

        res.status(200).json({
            message: "Task updated successfully"
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};
const addnewemployeeintoproject = async (req, res) => {
    try {
        const { projectName, name, empid, role, task, deadline, status } = req.body;
        const db = req.app.locals.db;


        if (!projectName || !name || !empid || !role || !task || !deadline) {
            return res.status(400).json({ message: "All fields are required" });
        }

    
        const existing = await db.collection("projects").findOne({
            projectName,
            "tasks.empid": empid
        });

        if (existing) {
            return res.status(400).json({
                message: "Employee already exists in this project"
            });
        }

        
        const newEmployeeTask = {
            name,
            empid,
            role,
            task,
            deadline,
            status: status || "pending",
            createdAt: new Date()
        };

       
        const result = await db.collection("projects").updateOne(
            { projectName },
            { $push: { tasks: newEmployeeTask } }
        );

      
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Project not found" });
        }

      
        if (result.modifiedCount === 0) {
            return res.status(400).json({ message: "Employee not added" });
        }

       
        res.status(200).json({
            message: "Employee added successfully",
            employee: newEmployeeTask
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.adminlogin = adminlogin;
exports.adminassigntasks = adminassigntasks;
exports.deleteemployee = deleteemployee;
exports.employeeupdation = employeeupdation;
exports.addnewemployeeintoproject = addnewemployeeintoproject;