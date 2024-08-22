
 const logout = async(req,res) => {
try {
    const tokenOption = {
        httpOnly : true,
        secure : true
    }  
    res.clearCookie('token', tokenOption);

    return res.status(200).json({
        error:false,
        message:'logut successfully from logout controller'
    })
    
} catch (error) {
    return res.status(500).json({
        message : error.message || error,
        error : true
    })
    console.log('here is the error from logout.js controller : ',error)
}
   
    
}

export default logout