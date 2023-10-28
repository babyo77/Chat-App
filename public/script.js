const socket = io();
const inputMessage = document.getElementById("inputMessage")
const sendBtn = document.getElementById("sendBtn")
const ChatConatiner = document.getElementById('ChatConatiner')
const emoji_list = ["😄","😃","😀","😁","😆","😅","😂","🤣","🥲","🥹","😊","😇","🙂","🙃","😉","😌","😍","🥰","😘","😗","😙","😚","😋","😛","😝","😜","🤪","🤨","🧐","🤓","😎","🥸","🤩","🥳","😏","😒","😞","😔","😟","😕","🙁","☹️","😣","😖","😫","😩","🥺","😢","😭","😮‍💨","😤","😠","😡","🤬","🤯","😳","🥵","🥶","😱","😨","😰","😥","😓","🫣","🤗","🫡","🤔","🫢","🤭","🤫","🤥","😶","😶‍🌫️","😐","😑","😬","🫠","🙄","😯","😦","😧","😮","😲","🥱","😴","🤤","😪","😵","😵‍💫","🫥","🤐","🥴","🤢","🤮","🤧","😷","🤒","🤕","🤑","🤠","😈","👿","👹","👺","🤡","💩","👻","💀","☠️","👽","👾","🤖","🎃","😺","😸","😹","😻","😼","😽","🙀","😿","😾"];


socket.on('reconnect', (attemptNumber) => {
    console.log(`Successfully reconnected after ${attemptNumber} attempts`);
  });

  socket.on('reconnect_error', (error) => {
    console.error('Reconnection error:', error);
    window.location.href =  window.location.href
  });

socket.on("message", (message,userId)=> {

    const typingNotifications = ChatConatiner.querySelectorAll('.typing-notification');
    typingNotifications.forEach((notification) => {
            ChatConatiner.removeChild(notification);})

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
  divElement.classList.add('border', 'self-start', 'border-red-600', 'text-justify', 'rounded-bl-lg', 'rounded-r-lg' ,'cursor-pointer','text-red-500');

  const pElement = document.createElement('p');
  pElement.id = 'Message';
  pElement.classList.add('p-2');
  pElement.textContent = `${userId} Left The Chat`


  divElement.appendChild(pElement);

  ChatConatiner.appendChild(divElement);
  scrollToBottom()

});

socket.on('user-connected', (userId) => {
    const divElement = document.createElement('div');
    divElement.id = 'container';
    divElement.classList.add('border', 'self-start','border-green-300' , 'text-justify', 'rounded-bl-lg', 'rounded-r-lg' ,'cursor-pointer','text-green-600');
  
    const pElement = document.createElement('p');
    pElement.id = 'Message';
    pElement.classList.add('p-2');
    pElement.textContent = `${userId} Joined The Chat`
  
  
    divElement.appendChild(pElement);
  
    ChatConatiner.appendChild(divElement);
      scrollToBottom()
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
    }, 1000); 
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
const joinRoomBtn = document.getElementById('joinRoomBtn'); 

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


function joinRoom(roomName) {
    let userId = localStorage.getItem("user")
    socket.emit('join-room', roomName,userId);
    ChatConatiner.innerHTML = '';
    roomDisplay.textContent = `Chat ID: ${roomName}`;
}


function generateRoomName() {
    return Math.random().toString(36).substr(2, 9);
}

document.getElementById("join-global").onclick=()=>{
    document.getElementById("rooms").style.display="none"
    document.getElementById("Chatconatiner").style.display="flex"
    ChatConatiner.style.display="flex"
    joinRoom("Global")
}



const fileInput = document.getElementById('fileInput');
const sendFile = document.getElementById('sendFile');

socket.on('file-receive', ({ fileName, fileData },userId) => {
  const fileType = getFileType(fileName);
  function getFileType(fileName) {
    const fileExtension = fileName.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(fileExtension)) {
      return 'image';
    } 
    return 'other'; // You can add more file type checks if needed
  }

  const divElement = document.createElement('div');
  divElement.id = 'files';
  divElement.classList.add('border', 'self-start', 'border-white', 'text-justify', 'break-words', 'rounded-bl-lg', 'rounded-r-lg', 'cursor-pointer');

  const userIdElement = document.createElement('p');
  userIdElement.classList.add('text-gray-400', 'text-xs', 'text-left', 'p-1', '-mb-2.5');
  userIdElement.textContent = userId;

  const fileElement = document.createElement('div');
  fileElement.classList.add('p-2', 'rounded-md');

  const fileNameElement = document.createElement('a');
  fileNameElement.href = URL.createObjectURL(new Blob([fileData]));
  fileNameElement.download = fileName;
  fileNameElement.innerHTML = `Download<br>${fileName}`;

  let fileRenderElement;
  if (fileType === 'image') {
    fileRenderElement = document.createElement('img');
    fileRenderElement.src = URL.createObjectURL(new Blob([fileData]));
    fileRenderElement.alt = fileName;
    fileElement.onclick = () => {
        const blobUrl = URL.createObjectURL(new Blob([fileData], { type: 'image/jpeg' }));
        window.open(blobUrl, '_blank');
    }     
  } else if (fileType === 'audio') {
    fileRenderElement = document.createElement('audio');
    fileRenderElement.controls = true;
    fileRenderElement.src = URL.createObjectURL(new Blob([fileData]));
  } else if (fileType === 'video') {
    fileRenderElement = document.createElement('video');
    fileRenderElement.controls = true;
    fileRenderElement.src = URL.createObjectURL(new Blob([fileData]));
  } else {
    fileRenderElement = fileNameElement;
  }
if(fileName.length > 27){
    divElement.classList.add('w-56')
}
  fileElement.appendChild(fileRenderElement);

  divElement.appendChild(userIdElement);    
  divElement.appendChild(fileElement);

  ChatConatiner.appendChild(divElement);
  removeProgressBar();
  scrollToBottom()
});




sendFile.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', (event) => {
  userId = localStorage.getItem('user');
  const file = event.target.files[0];
   if (file && file.size <= 100 * 1024 * 1024) {
    const reader = new FileReader();

   // ...

reader.onloadstart = () => {
    // Create and append the progress bar with text
    const progressBar = createProgressBar();
    ChatConatiner.appendChild(progressBar);
  };
  
  reader.onload = (e) => {
    const fileName = file.name;
    const fileData = e.target.result;
  
    // Send the file data to the server
    socket.emit('file-upload', { fileName, fileData }, userId);
  };
  
  reader.onprogress = (e) => {
    if (e.lengthComputable) {
      // Calculate percentage based on bytes loaded and total file size
      const percentComplete = (e.loaded / e.total) * 100;
      const bytesUploaded = e.loaded;
      const totalBytes = e.total;
  
      // Update the progress bar with percentage and bytes uploaded
      updateProgressBar(percentComplete, bytesUploaded, totalBytes);
    }
  };

    reader.readAsArrayBuffer(file);
  }else{
    alert('File size should be up to 128 MB');

    fileInput.value = null;
  }
});


function createProgressBar() {
  const progressBarContainer = document.createElement('div');
  progressBarContainer.id = 'progress-bar-container';
  progressBarContainer.classList.add('relative');

  const progressBar = document.createElement('div');
  progressBar.id = 'progress-bar';
  progressBar.classList.add('h-4', 'bg-blue-500');

  const progressBarText = document.createElement('p');
  progressBarText.id = 'progress-bar-text';
  progressBarText.classList.add('absolute', 'top-1/2', 'left-1/2', 'transform', '-translate-x-1/2', '-translate-y-1/2');

  progressBarContainer.appendChild(progressBar);
  progressBarContainer.appendChild(progressBarText);

  return progressBarContainer;
}

function updateProgressBar(percentComplete, bytesUploaded, totalBytes) {
  const progressBar = ChatConatiner.querySelector('#progress-bar');
  const progressBarText = ChatConatiner.querySelector('#progress-bar-text');
  if (progressBar && progressBarText) {
    progressBar.style.width = percentComplete + '%';
    progressBarText.textContent = `${Math.round(percentComplete)}%`;
  }
}

function removeProgressBar() {
  const progressBarContainer = ChatConatiner.querySelector('#progress-bar-container');
  if (progressBarContainer) {
    ChatConatiner.removeChild(progressBarContainer);
  }
}
