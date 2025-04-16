import baseUri from "./api-uri"


const BASE_URL= baseUri() 
export default async function search(query){
    const res = await fetch(BASE_URL+'search/'+query)
   if(res.ok){
      return await res.json()
   }
   else console.log('error getting current user')
}