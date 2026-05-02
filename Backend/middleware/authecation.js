const jwt = require("jsonwebtoken"); 
const jwt_key = process.env.JWT_SECRETE_KEY;
const authecation = (request, response, next) => {
    try{
        let token; 
        const jwt_token = request.headers["authorization"]; 
        if(jwt_token !== undefined){
            token = jwt_token.split(" ")[1]; 
        }
        if(token === undefined){
            return response.status(401).json({
                message: "invalid JWT token"
            })
        }else{
            jwt.verify(token, jwt_key, (error, payload) => {
                if(error){
                    response.status(401).json({
                        message: "Invalid JWT token"
                    })
                }else{
                    request.user = payload; 
                    next(); 
                }
            })
        }
    }
    catch(error){
        response.status(501).json({
            message: "Internal server error"
        })
    }

}

module.exports = authecation; 