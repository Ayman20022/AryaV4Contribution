import baseUri from "./api-uri"


const BASE_URL = baseUri()

interface ResponseWrapper<T>{
   flag:boolean,
   code:number,
   message:string,
   data:T
}

interface ResponseWrapperList<T>{
   flag:boolean,
   code:number,
   message:string,
   data:{
      content:T
   }
}


interface CurrentUser{
      id   : string,
      firstName   : string,
      //? to add it on the backend
      name:string,
      lastName   : string,
      username   : string,
      email   :string,
      bio   : string,
      avatarUrl   : string,
      preferences   : string,
      birthDate   : string,
      balance   : number,
      networking   : number,
      networked   : number,
      createdAt   : string,
      updatedAt   : string
}

interface User{
      id: string,
      //? to add it on the backend
      name:string,
      firstName: string,
      lastName: string,
      username: string,
      bio: string,
      networking: number,
      networked: number,
      avatarUrl: string,
      isFollowing:boolean
}



async function getCurrentUser():Promise<CurrentUser>{
   const resHeader = await fetch(BASE_URL+'users/me')
   const resBody:ResponseWrapper<CurrentUser> = await resHeader.json()
   return resBody.data
   
   
}

async function getNetworkedUsers(userId): Promise<User[]> {
   const resHeader = await fetch(BASE_URL+'users/'+userId+'/networked')
   const resBody:ResponseWrapperList<User[]> = await resHeader.json()
   return resBody.data.content
 };

 async function getNetworkingUsers(userId): Promise<User[]> {
   const resHeader = await fetch(BASE_URL+'users/'+userId+'/networking')
   const resBody:ResponseWrapperList<User[]> = await resHeader.json()
   console.log('current users\n',resBody)
   return resBody.data.content
 };


async function updateUser(username,userdata){
   const res = await fetch(BASE_URL+'users/'+username,{
      method:'POST',
      headers:{'Content-type':'application/json'},
      body:userdata
   })
   return await res.json()
}

async function findUserByUsername(username):Promise<User> {
   const resHeader = await fetch(BASE_URL+'users/'+'profile/'+username)
   const resBody:ResponseWrapper<User> = await resHeader.json()
   return resBody.data

}

async function getAllUsers(){
   const res = await fetch(BASE_URL+'users')
   return await res.json()
}





export {findUserByUsername ,getCurrentUser,getAllUsers}
export type {User}