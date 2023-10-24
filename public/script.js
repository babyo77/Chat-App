const socket = io();
const inputMessage = document.getElementById("inputMessage")
const sendBtn = document.getElementById("sendBtn")
const ChatConatiner = document.getElementById('ChatConatiner')

socket.on("message", message => {
    const divElement = document.createElement('div');
    divElement.id = 'sender';
    divElement.classList.add('border', 'self-start', 'border-white', 'h-7', 'rounded-bl-lg', 'rounded-r-lg');

    const pElement = document.createElement('p');
    pElement.classList.add('px-3');
    pElement.textContent = message;

    divElement.appendChild(pElement);

    ChatConatiner.appendChild(divElement);

})

sendBtn.addEventListener('click', () => {
    if (!inputMessage.value.trim()) {

    } else {
        const message = inputMessage.value
        socket.emit("message", message)

        const divElement = document.createElement('div');
        divElement.id = 'sender';
        divElement.classList.add('border', 'self-end', 'border-white', 'h-7', 'rounded-br-lg' , 'rounded-l-lg');

        const pElement = document.createElement('p');
        pElement.classList.add('px-3');
        pElement.textContent = message;


        divElement.appendChild(pElement);

        ChatConatiner.appendChild(divElement);

        inputMessage.value=""

       
    }
})
