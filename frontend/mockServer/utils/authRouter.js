const {findUserByEmail,createUser,comparePasswords} = require('./userService')
const express = require('express')
const router = express.Router()

const jwt = require('jsonwebtoken')
const {jwt_secret} = require('../secret-key')



router.post('/register',(req,res)=>{
    const {email,username,password} = req.body
    const res_ = createUser(email,username,password)
    if (res_.message=='success'){
        return res.status(201).json({message:'User registered successfully'})
    }
    else{
        return res.status(500).json({message:'Registration failed !'})
    }
})

router.post('/login',(req,res)=>{
    const {email,password} = req.body
    const user = findUserByEmail(email)
    if(user) {
        const hashedPass = user['password']
        const isMach = comparePasswords(password,hashedPass)
        if(!isMach) return res.status(401).json({message:'Incorrect Password'})
        const token = jwt.sign({username:user['username']},jwt_secret,{expiresIn:'1h'})
        res.status(200).json({'accessToken':token})
    }
    return res.status(401).json({message:'Incorrect email or password'})
})


router.get('/',(req,res)=>{
    return res.status(200).json({message:'router working fine'})
})

module.exports=router


