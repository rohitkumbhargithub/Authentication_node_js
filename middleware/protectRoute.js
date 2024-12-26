const User = require("../model/userModel.js");
const jwt = require('jsonwebtoken');

const protectRoute = async(req, res, next) => {
    try{
        const token = req.cookies.jwt;

        if (!token) {
            return res.redirect("/sign-in");
          }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded){
            return res.status(401).json({ error: "Unauthorized: Invalid Token" })
        }

        const user = await User.findById(decoded.userId).select("-password");

        if(!user){
            return res.redirect("/sign-in");
        }
        
        req.user = user;
        next();

    }catch(error){
        console.log("Error in protectRoute middleware", error.message);
		return res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = protectRoute;