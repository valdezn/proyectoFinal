const socket = io();
let user;

const chatbox = document.getElementById("chatbox");
const messageLogs = document.getElementById("messageLogs");

Swal.fire({
  title: "Identificate",
  input: "text",
  inputValidator: (value) => {
    return !value && "necesitas escribir un nombre para identificarte";
  },
  allowOutsideClick: false,
}).then((result) => {
  console.log(result.value)
  user = result.value;
  socket.emit("authenticatedUser", user);
});

chatbox.addEventListener("keyup", (evt) => {
  if (evt.key === "Enter") {
    socket.emit("message", { user: user, message: chatbox.value });
    chatbox.value = "";
  }
});

socket.on("imprimir", (data) => {
  let mensajes = "";
  data.forEach((msj) => {
    mensajes += `${msj.user} escribio: ${msj.message} <br/>`;
  });
  messageLogs.innerHTML = mensajes;
});

socket.on('newUserAlert', (data)=>{
  if (!user) return
  Swal.fire({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 5000,
    title:  data + ' se ha unido al chat',
    icon: 'success'
  })

})