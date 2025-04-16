const bcrypt = require('bcrypt')
const db = require('./db-setup')



const findUserByEmail = (email)=>{
    const st = db.prepare('SELECT * FROM users WHERE email = ?')
    return st.get(email)
}

const findUserByUsername = (username)=>{
    const st = db.prepare('SELECT * FROM users WHERE username = ?')
    return st.get(username)
}

const updateUser = (userdata)=>{
    const {name,email,username} = userdata
    const st = db.prepare('INSERT INTO users(name,email,username) VALUES (?,?,?)')
    try{
        st.run(name,email,username)
        return {message:'success'}
    }catch(error){
        return {message:'error'}
    }

} 

const comparePasswords = (plain,hashed)=>{
    return bcrypt.compareSync(plain,hashed)
}

const createUser = (email,username,password)=> {
    const user = findUserByEmail(email)
    if(!user){
        const hashedPassword = bcrypt.hashSync(password,10)
        const st = db.prepare('INSERT INTO users(email,username,password) VALUES (?,?,?)')
        try{
            st.run(email,username,hashedPassword)
            return {message:'success'}
        } 
        catch(error){
            return {message:'error'}
        };
        
    }
    return {message:'exist'}
}





module.exports={createUser,findUserByEmail,comparePasswords,findUserByUsername}
