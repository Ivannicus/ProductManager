import express from 'express';
import handlebars from 'express-handlebars'
import __dirname from './utils.js';
import {Server} from 'socket.io';
import mongoose from 'mongoose';
import { chatsModel } from './dao/models/chat.model.js';
import session from "express-session";
import MongoStore from 'connect-mongo';

const app = express()
const httpServer = app.listen(8080, () => console.log('Servidor corriendo en el puerto 8080'));
try{
    mongoose.connect('mongodb+srv://ivannicus95:conexion2814@coderbackend.axr4spz.mongodb.net/?retryWrites=true&w=majority')
    console.log('Connected to the DB')
} catch(error){
    console.log(error.message);
}

const io = new Server(httpServer);
//Ojito a las 2 siguientes lineas
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname+'/public'))

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname+'/views')
app.set('view engine', 'handlebars')

import productsRouter from './routes/products.js';
import cartsRouter from './routes/carts.js';
import viewRouter from './routes/view.router.js';
import sessionsRouter from './routes/sessions.router.js';

app.use(session({
    store: MongoStore.create({
        client: mongoose.connection.getClient(),
        ttl: 3600
    }),
    secret: 'Coder47300Secret',
    resave: true,
    saveUninitialized: true,
}));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/', viewRouter);

let messages = [];
io.on('connection', socket=> {
    console.log("New customer connected")

    socket.on('message', async data => {
        messages.push(data);
        const user = data.user;
        const message = data.message;
        console.log(user, message);
        try {
            await chatsModel.create({
                user,
                message
            });
        } catch (error) {
            console.log(error.message);
        }
        
        io.emit('messageLogs', messages);
    });

    socket.on('authenticate', () => {
        socket.emit('messageLogs', messages);

    });
    socket.broadcast.emit('userConnected', {user: 'Nuevo usuario conectado'});
})

export default io
