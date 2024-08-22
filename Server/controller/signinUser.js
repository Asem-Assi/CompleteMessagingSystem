import bcrypt from 'bcryptjs'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'

const signin=async(req,res)=>{
    try {
        
        const {email,password}=req.body

        if(!email)
        {
               throw new Error('please provide email')
        }
        if(!password)
            {
                   throw new Error('please provide password')
            }

            const user=await userModel.findOne({email})

            if(!user)
            {
                throw new Error('please signup')
            }
             
            const comparePassword= await bcrypt.compare(password,user.password)
            if(!comparePassword)
            {
                throw new Error('credential error')
            }

            const tokenData={_id:user.id,email:user.email}
            const privateKey = process.env.PRIVATE_KEY;


            const token=await jwt.sign(tokenData,process.env.PRIVATE_KEY,{ expiresIn: '8h' })

            const tokenOption = {
                httpOnly : true,
                secure : true
            }
    
       return   res.cookie("token",token,tokenOption).status(200).json({
                message : "Login successfully",
                success : true,
                error : false
            })
            

    } catch (error) {
        console.log('here is the error catch from signinUser.js controller :',error)
 
        return res.status('400').json({error:true,message:error.message})    }
   

}
export default signin