const socket = io();

let user;
let chatBox = document.getElementById("chatBox");

Swal.fire({
    title: "Identificate",
    input: "text",
    text: "Ingresa tu correo para identificarte en el chat",
    inputValidator: (value) => {
        return !value && "Necesitas escribir un correo para continuar"
    },
    allowOutsideClick: false
}).then(result => {
    user=result.value

    socket.emit('authenticate');

    socket.on('messageLogs', data => {
        let log = document.getElementById('messageLogs');
        let messages = "";
        data.forEach(message => {
            messages = messages + `${message.user} dice: ${message.message}</br>`
        })
        log.innerHTML = messages;
    });

    socket.on('userConnected', data => {
        Swal.fire({
            text: "Nuevo usuario conectado",
            toast: true,
            position: "top-right"
        });
    })

    

});

chatBox.addEventListener('keyup', e => {
    if(e.key==="Enter") {
        if(chatBox.value.trim().length > 0) {
            const message = chatBox.value
            socket.emit("message", {user: user, message: message});
            chatBox.value = "";
        }
    }
})