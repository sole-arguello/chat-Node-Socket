import express from "express";
import { __dirname } from "./utils.js";
import path from "path";
import { engine } from "express-handlebars";
import { viewsRouter } from "./routes/views.routes.js";
import { Server } from "socket.io";

const port = process.env.PORT || 8080
const app = express();

//midleware
app.use(express.json())
app.use(express.static(path.join(__dirname, "public")))

//servidor de http con express
const httpServer = app.listen(port, () => {console.log(`Servidor escuchando en el puerto ${port}`)})
//servidor de websockets con socket.io
const io = new Server(httpServer)

//configuracion
app.engine("hbs", engine({extname: ".hbs"}))
app.set("view engine", "hbs")
app.set("views", path.join(__dirname, "views"))


//routes
app.use("/", viewsRouter)

//para guardar los mensajes
let chat = []

//socket servidor
io.on("connection", (socket) => {
    console.log("Nuevo cliente conectado");


    //cuando se conecte el usuario, le envio el historial del chat
    socket.emit('chatHistory', chat)


    //recibo el mensaje del cliente
    socket.on("messageChat", (data) => {//data es el mensaje
        console.log(data);
        chat.push(data)
        //envio el historial del chat a todos los usuarios conectados
        io.emit("chatHistory", chat)
    })

    //recibo el mensaje de conexion de nuevo cliente
    socket.on('authenticated', (data)=>{
        socket.broadcast.emit('newUser', `El usuario 
        ${data} se acaba de conectar`)
    })
})

//habro un navegador INCOGNITO y envio mensajes, habro otro navegador al 
//mismo tiempo y envio mensajes en paralelo como un chat,