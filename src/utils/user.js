const users=[]
const addusers=({ id, username, Room })=>{
    username=username.trim().toLowerCase()
    Room=Room.trim().toLowerCase()
    if(!username || !Room){
        return {
            error:'Please provide a username and a Room'
        }
    }
   const flag=users.find((user)=>{
       return user.Room===Room && user.username===username
   }) 
   if(flag){
       return {
        error:'Username already Exist'   
       }
   }
   const user={ id ,username, Room }
   users.push(user)
   return { user }
}
const removeusers=(id)=>{
    const index=users.findIndex((user) => user.id===id)
    if(index!==-1){
        return users.splice(index, 1)[0]
    }
}

const getuser=(id) => {
   return users.find((user)=>user.id===id)
}

const getuserroom=(Room)=>{
    Room=Room.trim().toLowerCase()
    return users.filter((user)=>user.Room ===Room)

}
// addusers({
//     id:22,
//     username:'Tushar  ',
//     Room:'  pilkhuwa    '
// })
// addusers({
//     id:23,
//     username:'Tomar',
//     Room: 'hapur'
// })
// addusers({
//     id:29,
//     username:'singh',
//     Room:'hapur'
// })
// console.log(users)
module.exports={
    addusers,
    removeusers,
    getuser,
    getuserroom
}