const socket = io();
const inputMessage = document.getElementById("inputMessage")
const sendBtn = document.getElementById("sendBtn")
const ChatConatiner = document.getElementById('ChatConatiner')

socket.on("message", (message,userId)=> {
    
    const messageWithLinks = convertUrlsToAnchors(message);
    const divElement = document.createElement('div');
    divElement.id = 'container';
    divElement.classList.add('border', 'self-start', 'border-white', 'text-justify', 'break-words', 'rounded-bl-lg', 'rounded-r-lg','cursor-pointer');

    const pElement = document.createElement('p');
    pElement.classList.add('p-2');
    pElement.id = "Message"
    pElement.innerHTML = messageWithLinks;

    const userIdElement = document.createElement('p');
    userIdElement.classList.add('text-gray-400', 'text-xs' , 'text-left' ,'p-1','-mb-2.5');
    userIdElement.textContent = userId;

    divElement.appendChild(userIdElement);


    divElement.appendChild(pElement);

    ChatConatiner.appendChild(divElement);

    scrollToBottom()
    checkMessageLength()

})

function SendMessage(){
    const userId=localStorage.getItem('user')
    if (!inputMessage.value.trim()) {

    } else {
        const message = inputMessage.value
        const messageWithLinks = convertUrlsToAnchors(message);
        socket.emit("message", message,userId)
        
        const divElement = document.createElement('div');
        divElement.id = 'container';
        divElement.classList.add('border', 'self-end', 'border-white', 'text-justify', 'break-words', 'rounded-br-lg' , 'rounded-l-lg' ,'cursor-pointer');

        const pElement = document.createElement('p');
        pElement.id = 'Message';
        pElement.classList.add('p-2');
        pElement.innerHTML = messageWithLinks;

        const userIdElement = document.createElement('p');
    userIdElement.classList.add('text-gray-400', 'text-xs' , 'text-right' ,'p-1','-mb-2.5');
    userIdElement.textContent = " You ";

    divElement.appendChild(userIdElement);

        divElement.appendChild(pElement);

        ChatConatiner.appendChild(divElement);
        
        inputMessage.value=""
       
        scrollToBottom()
        checkMessageLength()
       
    }
}

SendMessage()

function convertUrlsToAnchors(message) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    return message.replace(urlRegex, (url) => {
        if (isImageURL(url)) {
            return `<a href="${url}" target="_blank"><img src="${url}" alt="Image Preview" class="chat-image" /></a>`;
        } else {
            return `<a href="${url}" target="_blank" class="text-blue-300">${url}</a>`;
        }
    });
}
sendBtn.addEventListener('click', () => {
    SendMessage()
})

function isImageURL(url) {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];
    const urlParts = url.split('.');
    const extension = urlParts[urlParts.length - 1].toLowerCase();
    return imageExtensions.includes(extension);
}

inputMessage.addEventListener('keydown',(e)=>{
    if(e.key==='Enter'){
       SendMessage()
    }
})


function scrollToBottom() {
    ChatConatiner.scrollTop = ChatConatiner.scrollHeight;
}


function checkMessageLength() {
    const messages = document.querySelectorAll("#container"); 

    messages.forEach(message => {
        const content = message.querySelector("#Message");
        if (content.textContent.length >= 27) {
            message.classList.add("w-56");
        }
    });
    
}

function setUserName(){
    let userId;
    try {
        if(!localStorage.getItem('user')){
            userId = prompt("Enter Your Name")
            if(userId.length>23){
                alert("Username To Long")
            }
            if(!userId.trim()){
             location.reload()
            }else{
            socket.emit("set-user-id", userId)
            localStorage.setItem("user",userId)
            }}
            else{
                userId=localStorage.getItem('user')
                socket.emit("set-user-id", userId)
            }
        
    } catch (error) {
        location.reload()
        
    }
}

setUserName()


socket.on('user-disconnected', (userId) => {
  const divElement = document.createElement('div');
  divElement.id = 'container';
  divElement.classList.add('border', 'self-start', 'border-red-600', 'text-justify', 'rounded-br-lg' , 'rounded-l-lg' ,'cursor-pointer','text-red-500');

  const pElement = document.createElement('p');
  pElement.id = 'Message';
  pElement.classList.add('p-2');
  pElement.textContent = "User Disconnectd " + userId;


  divElement.appendChild(pElement);

  ChatConatiner.appendChild(divElement);

});

socket.on('user-connected', (userId) => {
    const divElement = document.createElement('div');
    divElement.id = 'container';
    divElement.classList.add('border', 'self-start','border-green-300' , 'text-justify', 'rounded-br-lg' , 'rounded-l-lg' ,'cursor-pointer','text-green-600');
  
    const pElement = document.createElement('p');
    pElement.id = 'Message';
    pElement.classList.add('p-2');
    pElement.textContent = "User Connected " + userId;
  
  
    divElement.appendChild(pElement);
  
    ChatConatiner.appendChild(divElement);
  
  });

checkMessageLength()


let isTyping = false;
let typingTimeout;

function sendTypingStatus() {
  let  userId= localStorage.getItem("user")
    if (!isTyping) {
        isTyping = true;
        socket.emit("typing", true,userId);
    }
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
        isTyping = false;
        socket.emit("typing", false,userId);
    }, 222); 
}

inputMessage.addEventListener("input", sendTypingStatus);

function displayTypingNotification(userId, isTyping) {

    if (isTyping) {
        const typingNotification = document.createElement('div');
        typingNotification.classList.add('typing-notification') 
        typingNotification.textContent = `${userId} is typing...`;
        ChatConatiner.appendChild(typingNotification);
        scrollToBottom()
    } else {
        const typingNotifications = ChatConatiner.querySelectorAll('.typing-notification');
        typingNotifications.forEach((notification) => {
                ChatConatiner.removeChild(notification);
        });
    }
}

socket.on("typing", (userId, isTyping) => {
    displayTypingNotification(userId, isTyping);
});


const roomInput = document.getElementById('roomInput');
const roomDisplay = document.getElementById('roomDisplay');
const joinRoomBtn = document.getElementById('joinRoomBtn'); // Add a "Join Room" button

// Function to join an existing room
joinRoomBtn.addEventListener('click', () => {
    if(roomInput.value.trim()){
        roomName = roomInput.value
        document.getElementById("rooms").style.display="none"
        document.getElementById("Chatconatiner").style.display="flex"
        ChatConatiner.style.display="flex"
        joinRoom(roomName);
    }else{
    const roomName = generateRoomName();
    document.getElementById("rooms").style.display="none"
    document.getElementById("Chatconatiner").style.display="flex"
    ChatConatiner.style.display="flex"
    joinRoom(roomName);}
});

// Function to join a room
function joinRoom(roomName) {
    let userId = localStorage.getItem("user")
    socket.emit('join-room', roomName,userId);
    ChatConatiner.innerHTML = '';
    roomDisplay.textContent = `Room ID: ${roomName}`;
}

// Function to generate a unique room name or ID
function generateRoomName() {
    return "room_" + Math.random().toString(36).substr(2, 9);
}

document.getElementById("join-global").onclick=()=>{
    document.getElementById("rooms").style.display="none"
    document.getElementById("Chatconatiner").style.display="flex"
    ChatConatiner.style.display="flex"
    joinRoom("Global")
}

