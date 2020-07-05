const socket=io()
const formselector=document.querySelector('#msg')
const inputselector=formselector.querySelector('input')
const buttonselector=formselector.querySelector('button')
const locbutton=document.querySelector("#loc")
const msgloc=document.querySelector("#msg-con")
const msgtemp=document.querySelector("#msg-template").innerHTML
const loctemp=document.querySelector("#loc-template").innerHTML
const sidebar=document.querySelector("#sidebar-template").innerHTML
const { username, Room }=Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoscroll=() => {
 const newmsg=msgloc.lastElementChild
 
 const newmsgstyle=getComputedStyle(newmsg)
 const newmsgmargin=parseInt(newmsgstyle.marginBottom)
 const newmsgheight=newmsg.offsetHeight + newmsgmargin

 //visible height
 const visibleheight=msgloc.offsetHeight
 //height of msg constainer
  const conheight=msgloc.scrollHeight
  //how far have i scrollled
  const scrolloffset=msgloc.scrollTop + visibleheight

  if(conheight - newmsgheight <= scrolloffset){
      msgloc.scrollTop=msgloc.scrollHeight

  }

}





socket.on('welcome',(message)=>{
    console.log(message)
    const html=Mustache.render(msgtemp,{
        username:message.username,
        message:message.text,
        createdAt:moment(message.createdAt).format('h:mm a')
    })
    msgloc.insertAdjacentHTML('beforeend',html)
    autoscroll()
})
socket.on('locationmessage',(location) =>{
    console.log(location)
    const html=Mustache.render(loctemp,{
        username:location.username,
        url:location.url,
        createdAt:moment(location.createdAt).format('h:m a')

    })
    msgloc.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

socket.on('RoomData',({ Room, users})=>{
    const html=Mustache.render(sidebar,{
        users,
        Room
    })
    document.querySelector("#sidebar").innerHTML=html
})



formselector.addEventListener('submit',(e)=>{
    e.preventDefault()
    buttonselector.setAttribute('disabled', 'disabled')
    // const message=document.querySelector('input').value
    const message=e.target.elements.message.value
    socket.emit('output',message, (error)=>{
        inputselector.value=''
        inputselector.focus()
        buttonselector.removeAttribute('disabled')
        if(error){
            return console.log(error)
        }
        console.log('correct')
    })
})

locbutton.addEventListener('click',()=>{
    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browser')
    }
    locbutton.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition( (position) =>{
        console.log(position)
        socket.emit('Location',{
            latitude: position.coords.latitude,
            longitude:position.coords.longitude,
            timestamp:position.timestamp
        },()=>{
            console.log('Location Shared positively')
            locbutton.removeAttribute('disabled')
        })
    })
})
socket.emit('join',{ username, Room },(error)=>{
    if(error){
        alert(error)
        location.href='/'
    }
})