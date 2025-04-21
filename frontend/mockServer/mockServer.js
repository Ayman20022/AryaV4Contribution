
const express = require('express')
const cors = require('cors')
const router = require('./utils/authRouter')
const userRouter = require('./utils/userRouter')
const users = require('./utils/users.json')
const posts = require('./utils/posts.json')



//* APP config

const app = express()
app.use(cors())
app.use(express.json());
const port = 4000



//? authController

app.use('/auth',router)
app.use('/users',userRouter)



//? postsController


app.get('/posts',(req,res)=>{
  res.status(200).json(posts)
})

app.get('/posts/:id',(req,res)=>{
  const id = req.params.id
  return res.status(200).json(posts.find(post=>post.id == id))
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
  posts.push(post)
  res.status(200).json({message:'new post added',post})
})












//? SearchController


// app.get('/search/:query',(req,res)=>{

//   const query = req.params.query

//   const filteredUsers = users.filter(user => 
//     user.name.toLowerCase().includes(query) || 
//     user.username.toLowerCase().includes(query)
//   );
  
//   const filteredPosts = postsData.filter(post => 
//     post.text.toLowerCase().includes(query)
//   );
  
//   const filteredPrompts = dummyPrompts.filter(prompt =>
//     prompt.title.toLowerCase().includes(query) ||
//     prompt.description.toLowerCase().includes(query)
//   );
  
//   return res.json({ 
//     users: filteredUsers.slice(0, 5), 
//     posts: filteredPosts.slice(0, 5),
//     prompts: filteredPrompts.slice(0, 5)
//   });

// })



app.listen(port,()=>{
    console.log(`listening on port : ${port}`)
})