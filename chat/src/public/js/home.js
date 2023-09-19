console.log('javaScript en el frontend');
//socket del cliente
const socketClient = io();

const userName = document.getElementById('userName')
const inputMessage = document.getElementById('inputMessage')
const sendMsg = document.getElementById('sendMsg')
const chatPanel = document.getElementById('chatPanel')

let user//variable para guardar el nombre del usuario
Swal.fire({
    title: 'chat',
    text: 'Por favor ingrese su nombre de usuario',
    input: 'text',
    inputValidator: (value) => {
        return !value && 'Debe ingresar el nombre de usuario para continuar'
    },
    allowOutsideClick: false,
    allowEscapeKey: false
}).then((inputValue) => {
    console.log(inputValue);
    user = inputValue.value
    userName.innerHTML = user
    socketClient.emit('authenticated', user)
})


sendMsg.addEventListener('click', () => {
    //obtengo el user y el mensaje del input
    console.log({user: user, message: inputMessage.value});
    const msg = {user: user, message: inputMessage.value}
    //envio el mensaje al cliente por websocket al socket del servidor
    socketClient.emit('messageChat', msg)
    inputMessage.value = ''//reset del input
})

//recibir el mensaje por parte del servidor
socketClient.on('chatHistory', (dataServer) => {
    console.log(dataServer);
    //replico los mensajes
    let msgElements = ''
    //recorro el array de mensajes
    dataServer.forEach(element => {
        msgElements += `
                        <p>Usuario: ${element.user}:
                        >>>> Mensaje: ${element.message}</p>
                        
                        `
    });
    //todos los elemtos de mensaje
    chatPanel.innerHTML = msgElements
})

//recibo del nuevo cliente
socketClient.on('newUser', (data) =>{
    if(user){//si el usuario se autentico
        Swal.fire({
            text: data,
            toast: true,
            position: 'top-right'
        })
    }

})

