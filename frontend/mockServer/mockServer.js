
const express = require('express')
const cors = require('cors')
const router = require('./utils/authRouter')
const { findUserByEmail, findUserByUsername } = require('./utils/userService')
const {usersData,postsData,dummyPrompts} = require('./utils/mockData') 


//* APP config

const app = express()
app.use(cors())
app.use(express.json());
const port = 4000



//? authController

app.use('/auth',router)

//? PostController

app.get('/posts/:id',(req,res)=>{
  const id = req.params.id
  console.log(id)
  const posts = postsData.find(post=>post.userId==id) 
  res.json(posts)
})


app.post('/posts/:id',(req,res)=>{
  const id = req.params.id
  const {text,images,link,agrees,disagrees,amplifiedBy,comments} = req.body
  const post= {
        id: crypto.randomUUID(),
        userId: id,
        text,
        images,
        link,
        createdAt: new Date(Date.now() - 3600000),
        agrees,
        disagrees,
        amplifiedBy,
        comments
      }
  postsData.push(post)
  res.status(200).json({message:'new post added',post})
})









//? UserController
//* User schema
/*
 {
      id: string
      name: string
      username: string
      avatar: string
      bio: string
      following: number,
      followers: number
  }
*/



app.get('/users/me',(req,res)=>{
  const user = usersData[0]
  console.log(user)
  res.json(user)
 })
 

app.get('/users/:username',(req,res)=>{
    const username_ = req.params.username
    const user = usersData.filter(user=>user.username==username_)[0]
    res.json(user)
})



app.post('/users/:username',(req,res)=>{
  const username_ = req.params.username
  const user = findUserByUsername(username_)
  if(user){
    const {name,bio,username2} = req.body
    if(name) user.name = name
    if(bio) user.bio = bio
    if(username2) user.username=username2
    const response = updateUser(user)
    if (response==='success') return res.status(204).json({flag:'success',message:'Ressource updated successfully'})
    else return res.status(500).json({flag:'error',message:'error updating user data'})
  }
  else res.status(500).json({message:'invalid username'})

})

app.get('/users',(req,res)=>{
  res.json(usersData)
})


//? SearchController


app.get('/search/:query',(req,res)=>{

  const query = req.params.query

  const filteredUsers = usersData.filter(user => 
    user.name.toLowerCase().includes(query) || 
    user.username.toLowerCase().includes(query)
  );
  
  const filteredPosts = postsData.filter(post => 
    post.text.toLowerCase().includes(query)
  );
  
  const filteredPrompts = dummyPrompts.filter(prompt =>
    prompt.title.toLowerCase().includes(query) ||
    prompt.description.toLowerCase().includes(query)
  );
  
  return res.json({ 
    users: filteredUsers.slice(0, 5), 
    posts: filteredPosts.slice(0, 5),
    prompts: filteredPrompts.slice(0, 5)
  });

})



app.listen(port,()=>{
    console.log(`listening on port : ${port}`)
})