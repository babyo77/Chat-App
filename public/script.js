const socket = io();
const inputMessage = document.getElementById("inputMessage")
const sendBtn = document.getElementById("sendBtn")
const ChatConatiner = document.getElementById('ChatConatiner')

socket.on("message", message => {

    const divElement = document.createElement('div');
    divElement.id = 'container';
    divElement.classList.add('border', 'self-start', 'border-white', 'text-justify', 'break-words', 'rounded-bl-lg', 'rounded-r-lg','cursor-pointer');

    const pElement = document.createElement('p');
    pElement.classList.add('p-2');
    pElement.id = "Message"
    pElement.textContent = message;

    divElement.appendChild(pElement);

    ChatConatiner.appendChild(divElement);

    scrollToBottom()
    checkMessageLength()

})

function SendMessage(){
    if (!inputMessage.value.trim()) {

    } else {
        const message = inputMessage.value
        socket.emit("message", message)
        
        const divElement = document.createElement('div');
        divElement.id = 'container';
        divElement.classList.add('border', 'self-end', 'border-white', 'text-justify', 'break-words', 'rounded-br-lg' , 'rounded-l-lg' ,'cursor-pointer');

        const pElement = document.createElement('p');
        pElement.id = 'Message';
        pElement.classList.add('p-2');
        pElement.textContent = message;


        divElement.appendChild(pElement);

        ChatConatiner.appendChild(divElement);
      
        inputMessage.value=""

        scrollToBottom()
        checkMessageLength()
       
    }
}

SendMessage()


sendBtn.addEventListener('click', () => {
    SendMessage()
})

inputMessage.addEventListener('keydown',(e)=>{
    if(e.key==='Enter'){
       SendMessage()
    }
})


function scrollToBottom() {
    ChatConatiner.scrollTop = ChatConatiner.scrollHeight;
}


function checkMessageLength() {
    const messages = document.querySelectorAll("#container"); // Adjust the class name as needed

    messages.forEach(message => {
        const content = message.querySelector("#Message");
        if (content.textContent.length >= 27) {
            message.classList.add("w-56");
        }
    });
    
}


checkMessageLength()

