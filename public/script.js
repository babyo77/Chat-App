const socket = io();
const inputMessage = document.getElementById("inputMessage")
const sendBtn = document.getElementById("sendBtn")
const ChatConatiner = document.getElementById('ChatConatiner')

socket.on("message", message => {
    scrollToBottom()
    
    const divElement = document.createElement('div');
    divElement.id = 'me';
    divElement.classList.add('border', 'self-start', 'border-white', 'text-left', 'break-words', 'rounded-bl-lg', 'rounded-r-lg');

    const pElement = document.createElement('p');
    pElement.classList.add('p-3');
    pElement.id = "Message"
    pElement.textContent = message;

    divElement.appendChild(pElement);

    ChatConatiner.appendChild(divElement);

    checkMessageLength()

})

function SendMessage(){
    if (!inputMessage.value.trim()) {

    } else {
        const message = inputMessage.value
        socket.emit("message", message)

        scrollToBottom()
        
        const divElement = document.createElement('div');
        divElement.id = 'me';
        divElement.classList.add('border', 'self-end', 'border-white', 'text-left', 'break-words', 'rounded-br-lg' , 'rounded-l-lg');

        const pElement = document.createElement('p');
        pElement.id = 'Message';
        pElement.classList.add('p-3');
        pElement.textContent = message;


        divElement.appendChild(pElement);

        ChatConatiner.appendChild(divElement);
      
        inputMessage.value=""
        checkMessageLength()
       
    }
}

SendMessage()


sendBtn.addEventListener('click', () => {
    SendMessage()
})

document.body.addEventListener('keydown',(e)=>{
    if(e.keyCode==13){
        e.preventDefault()
       SendMessage()
    }
})

function scrollToBottom() {
    ChatConatiner.scrollTop = ChatConatiner.scrollHeight;
}


function checkMessageLength() {
    const messages = document.querySelectorAll("#me"); // Adjust the class name as needed

    messages.forEach(message => {
        const content = message.querySelector("#Message");
        if (content.textContent.length >= 16) {
            message.classList.add("w-56");
        }
    });
}


checkMessageLength()


