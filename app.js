import express from 'express';
import handlebars from 'express-handlebars'
import __dirname from './utils.js';
import {Server} from 'socket.io';


const app = express()
const httpServer = app.listen(8080, () => console.log('Servidor corriendo en el puerto 8080'));

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

io.on('connection', socket=>{
    console.log("New customer connected")
})

export default io