
//configuracion del servidor cargamos los modulos necesarios y los configuramos
//importamos el modulo express
const express = require('express');

const app = express()
const port = process.env.port || 3030;

//importamos uuid
const { v4 : uuidv4 } = require('uuid');

//importamos y configuramos mysql
const mysql = require('mysql');

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'curso',
})

//Inicializamos el servidor
const server = app.listen(`${port}`, ()=>{
    //mensaje conocimiento
    console.log(`Server started on port ${port}`);
    //conexion a mysql
    connection.connect(function(error) {
        console.log('ERROR: No ha podido conectarse a la base de datos'); // 'ECONNREFUSED'
        server.close();
    });
});

//se importa e inicializa el socket
const io = require('socket.io')(server, {
    cors: {origin: '*'}
});

//configuramos el socket
io.on("connection", (socket) => {
    //obtenemos fecha y hora
    var hoy = new Date();
    var fecha = hoy.getDate() + '-' + ( hoy.getMonth() + 1 ) + '-' + hoy.getFullYear();
    var hora = hoy.getHours() + ':' + hoy.getMinutes() + ':' + hoy.getSeconds();
    var fechaYHora = fecha + ' ' + hora;

    //obtenemos la ip
    const ip = socket.handshake.headers['x-forwarded-for'] || socket.conn.remoteAddress.split(":")[3];
    //mostramos por consola el cliente conectado
    console.log(fechaYHora + ' ->client ' + ip + ' connected');

    //mostramos por consola el cliente que desconecta
    socket.on('disconnect', ()=>{
        console.log(fechaYHora + ' <-client ' + ip + ' disconnected');
    });

    socket.on('order', (data)=>{
        //console.log(data);
        let order = {
            order_code: uuidv4(),
            item_id: data.item_id,
            created_at: mysql.raw('CURRENT_TIMESTAMP()'),
            updated_at: mysql.raw('CURRENT_TIMESTAMP()')
        }

        connection.query('INSERT INTO orders SET ?', order, (error, results)=>{
            if (error) throw error;
            console.log(results);

            io.emit('order_processed', order);
        })
    })
});
