import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const AdminMiddleware=async(req,res,next)=>{

    const token=req.headers.authorization?.split(' ')[1]

    try{
        console.log("Middleware is here")
        if(!token){
            console.log("Middleware:User Token is Invalid")
            return res.status(401).json("Unauthorized Acess Detected")
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        console.log(decoded)
        const user=await User.findById(decoded.userId)
        if(!user){
            console.log("middleware:Not found error")
            return res.status(404).json({message:"User not found"})
        }
        if(user.role==="admin"){
            req.user=user
            next()
        }else{
            res.status(403).json({message:"Admin required"})
        }
       

    }catch(error){
        console.error(error)
        res.status(500).json({message:"Internal Server Error"})
    }

}