import express from 'express';
import handlebars from 'express-handlebars'
import __dirname from './utils.js';
import {Server} from 'socket.io';
import mongoose from 'mongoose';

const app = express()
const httpServer = app.listen(8080, () => console.log('Servidor corriendo en el puerto 8080'));
try{
    mongoose.connect('mongodb+srv://ivannicus95:conexion2814@coderbackend.axr4spz.mongodb.net/?retryWrites=true&w=majority')
    console.log('Connected to the DB')
} catch(error){
    console.log(error.message);
}

const io = new Server(httpServer);

app.engine('handlebars', handlebars.engine());

app.set('views', __dirname+'/views')
app.set('view engine', 'handlebars')

app.use(express.static(__dirname+'/public'))


import productsRouter from './routes/products.js';
import cartsRouter from './routes/carts.js';
import viewRouter from './routes/view.router.js'
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewRouter);

let messages = [];
io.on('connection', socket=>{
    console.log("New customer connected")

    socket.on('message', data => {
        messages.push(data);
        io.emit('messageLogs', messages);
    });

    socket.on('authenticate', () => {
        socket.emit('messageLogs', messages);

    });
    socket.broadcast.emit('userConnected', {user: 'Nuevo usuario conectado'});
})

export default io