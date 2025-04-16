import baseUri from "./api-uri"
import axios from 'axios'


const BASE_URL = baseUri()



async function findUserById(userid) {
   const res = await fetch(BASE_URL+'users/'+userid)
   return await res.json()

}

//! TEST THIS FUNCTION 


async function updateUser(username,userdata){
   const res = await fetch(BASE_URL+'users/'+username,{
      method:'POST',
      headers:{'Content-type':'application/json'},
      body:userdata
   })
   return await res.json()
}

async function getAllUsers(){
   const res = await fetch(BASE_URL+'users')
   return await res.json()
}

async function getCurrentUser() {
   const res = await fetch(BASE_URL+'users/me')
   if(res.ok){
      return await res.json()
   }
   else console.log('error getting current user')
   
}




export {findUserById,getCurrentUser,getAllUsers}