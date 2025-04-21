const express = require('express')
const router = express.Router()
const users = require('./users.json')

const jwt = require('jsonwebtoken')
const {jwt_secret} = require('../secret-key')
const fs = require('fs')
const path = require('path')



router.post('/register',(req,res)=>{
    const {email,username,name,password,bio} = req.body
    try {
        const newUser = {
            id: String(Number(users.slice(-1)[0].id) + 1),
            email,
            username,
            password,
            name,
            avatar:'https://i.pravatar.cc/150?img=32',
            bio,
            following: 0,
            followers: 0,
        }

        users.push(newUser)

        fs.writeFileSync(path.join(__dirname,'users.json'),JSON.stringify(users,null,2))


        

    return res.status(201).json({message:'User registered successfully'})

    } catch (error) {
        return res.status(500).json({message:'Error registering user'})
    }
})

router.post('/login',(req,res)=>{
    const {email,password} = req.body
    console.log(email,password)
    const user = users.find(user=>user.email==email)
    if(user) {
        const pass = user['password']
        const isMach = pass == password
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


