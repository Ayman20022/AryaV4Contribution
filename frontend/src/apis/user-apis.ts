import baseUri from "./api-uri"


const BASE_URL = baseUri()

interface Wrapper1<T>{
   flag:boolean,
   code:number,
   message:string,
   data:T
}


interface Wrapper2<T>{
      content:T,
      pagable:{
         pageNumber:number,
         pageSize:number,
         sort:{
            empty:boolean,
            sorted:boolean,
            unsorted:boolean
         },
         offset:number,
         paged:boolean,
         unpaged:boolean
      },
      totalpages:number,
      totalElements:number,
      last:boolean,
      size:number,
      number:number,
      sort:{
         "empty":false,
         "sorted":boolean,
         "unsorted":boolean
      },
      numberOfElements:number,
      first:boolean,
      empty:boolean
   }


   interface AvatarUrl{
      avatarUrl: string
   }


interface CurrentUser{
      id   : string,
      firstName   : string,
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
   const resBody:Wrapper1<CurrentUser> = await resHeader.json()
   return resBody.data
   
   
}

async function getNetworkedUsers(userId) {
   const resHeader = await fetch(BASE_URL+'users/'+userId+'/networked')
   const resBody:Wrapper1<Wrapper2<User[]>> = await resHeader.json()
   const data = resBody.data.content
   console.log('recieved networked users',data)
   return data
 };

 async function getNetworkingUsers(userId) {
   const resHeader = await fetch(BASE_URL+'users/'+userId+'/networking')
   const resBody:Wrapper1<Wrapper2<User[]>> = await resHeader.json()
   const data = resBody.data.content
   console.log('recieved networking users',data)
   return data
 };


async function updateUser(userdata){
   const resHeader = await fetch(BASE_URL+'users/update',{
      method:'POST',
      headers:{'Content-type':'application/json'},
      body:JSON.stringify(userdata)
   })

   const resBody:Wrapper1<User> = await resHeader.json()
   console.log('update response',resBody.data)
   return resBody
}

async function updateUserAvatar(imageString) {
   const formData = new FormData();
   formData.append('avatar', imageString); 
 
   const resHeader = await fetch(BASE_URL + 'users/update/avatar', {
     method: 'POST',
     body: formData, 
   });
 
   const resBody:Wrapper1<AvatarUrl>  = await resHeader.json();
   console.log('update response', resBody.data);
   return resBody;
 }

async function findUser(userId):Promise<User> {
   const resHeader = await fetch(BASE_URL+'users/profile/'+userId)
   const resBody:Wrapper1<User> = await resHeader.json()
   return resBody.data

}

async function getAllUsers(){
   const res = await fetch(BASE_URL+'users')
   return await res.json()
}





export {findUser ,getCurrentUser,updateUserAvatar,getAllUsers,updateUser,getNetworkingUsers,getNetworkedUsers}
export type {User}