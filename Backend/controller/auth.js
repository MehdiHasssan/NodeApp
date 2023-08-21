const Joi = require ('joi')
const User = require('../models/user')
const bycrypt = require ('bcryptjs')
const UserDTO= require('../dto/userDto')
const JWTService = require('../services/JWTService')
const RefreshToken = require('../models/token')

const authController ={
    async register (req , res,next ){
        //validate user input 
        const userRegisterSchema = Joi.object({
            username : Joi.string().min(5).max(30).required(),
            name : Joi.string().min(5).max(30).required(),
            email: Joi.string().email().required(),
            password : Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
            confirm_password : Joi.ref('password')
        })

        const {error} = userRegisterSchema.validate(req.body)
        //if error in validation return error via middleware
        if(error){
            return next(error)
        }
        //if email or name already registered return user already register
        const {username ,name, email,password} = req.body;
        try{
            const emailInUse = await User.exists({email})
            const usernameInUse = await User.exists({username})

            if(emailInUse) {
                const error ={
                    status : 401,
                    message:'Email already in use, try another one'
                }
                return next(error)
            }
            if(usernameInUse){
              const error = {
                status :409,
                message: "Username already in use" 
              }  
              return next (error)
            }
        }
        catch(error){
            return next(error)
        }
        // password hash via bycrypt
        const hashPassword = await bycrypt.hash(password,10)

        let accessToken;
        let refreshToken;
        let user;
        
        try{
 //store data in database
            const userToRegister = new User({
                username,
                name,
                email,
                password: hashPassword
            })
           user = await userToRegister.save()

          //TOKEN generation
          accessToken = JWTService.signAccessToken({_id: user._id, username:user.username},'30m')

          refreshToken = JWTService.signRefreshToken({_id:user._id},'60m')
        }
        catch(error){
            return next (error)
        }

        // store refreshToken
       await JWTService.storeRefreshToken(refreshToken,user._id)

        //send token in cookies 
        res.cookie ('accessToken',accessToken,{
            maxAge:1000*60*60*24,
            httpOnly: true
        })

        res.cookie('refreshToken',refreshToken,{
            maxAge: 1000*60*60*24
        })
       
       //data after dto 
       const userDto = new UserDTO (user)
        //response send 

        return res.status(201).json({message: "Register Successfully",user:userDto,auth : true})
    },

    // Login Controller
    async login (req,res,next) {
        //validate user 
        const loginUserSchema = Joi.object({
            username : Joi.string().min(5).max(30).required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
        })

        const { error } = loginUserSchema.validate(req.body)

        // if error 
        if (error){
            return next(error)
        }
        // match username 
        const {username ,password} = req.body;
        let user;
        try {
             user = await User.findOne({username});
            if (!user) {
                const error={
                    status : 401,
                    message : "invalid username"
                }
                return next (error)
            }

            // match password
            const match = await bycrypt.compare(password, user.password)

            if (!match){
                const error ={
                    status : 401,
                    message: "Invalid Password"
                }
                return next(error)
            }
        }
        
        catch(error){
            return next (error)
        }

        const accessToken = JWTService.signAccessToken({_id: user._id},'30')
        const refreshToken = JWTService.signRefreshToken({_id:user._id},'60')

        //update refresh token in db
     try{   
        await RefreshToken.findOne({
            _id:user._id,

        },
        {token:refreshToken},
        {upsert:true}
        )
}
    catch(error){
        return next(error)
    }
        //send token in cookie
        res.cookie('accessToken',accessToken,{
            maxAge:1000*60*60*24,
            httpOnly:true
        })
        res.cookie('refreshToken',refreshToken,{
            maxAge: 1000*60*60*24,
            httpOnly:true
        })

        const userDto = new UserDTO (user)
        return res.status(200).json({message : "Login Successfully",user: userDto, auth:true,token:accessToken})
    },

    async logout(req,res ,next){
        // delete refresh token
        const {refreshToken} = req.cookies
        try{
           await RefreshToken.deleteOne({token: refreshToken})
        }
        catch(error){
            return next(error)
        }
        // clear cookie 
        res.clearCookie('accessToken') 
        res.clearCookie('refreshToken')

        //response
        res.status(200).json({user:null, auth:false})
    },


    async refresh(req,res,next){
        // get refreshToken from cookie
        const orignalRefreshToken = req.cookies.refreshToken
        // verify refreshToken 
        let id;
        try{
            id = JWTService.verifyRefreshToken(orignalRefreshToken)._id
        }
        catch(e){
            const error ={
                status :401,
                message :"Unauthorized"
            }
            return next (error)
        }

        // to match token in db 
        try{
            const match = RefreshToken.findOne({_id:id, token:orignalRefreshToken})

            if(!match) {
                const error ={
                    status: 401,
                    message:'Unauthorized'
                }
                return next(error)
            }
        }
        catch(e){
            return next (e)
        }
        // generate new token
        try{
            const accessToken = JWTService.signAccessToken({_id:id},'30m')
            const refreshToken = JWTService.signRefreshToken({_id:id},'60m')
           await RefreshToken.updateOne({_id:id},{token:refreshTokenefreshToken})

           res.cookie('accessToken',accessToken,{
            maxAge: 1000*60*60*24,
            httpOnly:true
           })

           res.cooke('refreshToken',refreshToken,{
            maxAge: 1000*60*60*24,
            httpOnly:true
           })

        }
        catch(e){
            return next(e)
        }
        // return response

        const user = User.findOne({_id:id})

        const userDto = new UserDTO(user)

        return res.status(200).json({user:userDto, auth:true})
    }

}
 
module.exports  = authController