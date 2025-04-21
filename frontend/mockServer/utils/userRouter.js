const express = require('express')
const userRouter = express.Router()
const fs = require('fs')
const path = require('path')
const users = require('./users.json')

userRouter.get('/me',(req,res)=>{
    const user = users[0]
    res.json(user)
   })
   
  
  userRouter.get('/:userid',(req,res)=>{
      const userid = req.params.userid
      const user = users.filter(user=>user.id==userid)[0]
      res.json(user)
  })
  
  
  userRouter.put('/:username',(req,res)=>{
    const user = users.find(user=>user.username == req.params.username)
    if(user){
      try {
        const {name,bio,username} = req.body
        if(name) user.name = name
        if(bio) user.bio = bio
        if(username) user.username=username
        users.push(user)
        fs.writeFileSync(path.join(__dirname,'utils','users.json'),JSON.stringify(users,null,2))
        return res.status(200).json({flag:'success',message:'Ressource updated successfully'})
      } catch (error) {
        return res.status(500).json({flag:'error',message:'error updating user data'})
      }
    }
    else res.status(500).json({message:'invalid username'})
  
  })
  
  userRouter.get('/',(req,res)=>{
    res.status(200).json(users)
  })


module.exports = userRouter