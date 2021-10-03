
//configuracion del servidor cargamos los modulos necesarios y los configuramos
//importamos el modulo express
const express = require('express');
//import express from 'express';

const app = express()
const port = process.env.port || 3030;

//importamos uuid
//import { v4 as uuidv4 } from 'uuid';

//importamos y configuramos mysql
const mysql = require('mysql');
//import { createConnection } from 'mysql';
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
    connection.connect();
});

//se importa e inicializa el socket
const io = require('socket.io')(server, {
    cors: {origin: '*'}
});

//configuramos el socket
io.on("connection", (socket) => {
    //obtenemos la ip
    const ip = socket.handshake.headers['x-forwarded-for'] || socket.conn.remoteAddress.split(":")[3];
    //mostramos por consola el cliente conectado
    console.log('->client ' + ip + ' connected');
    //mostramos por consola el cliente que desconecta
    socket.on('disconnect', ()=>{
        console.log('<-client ' + ip + ' disconnected');
    });
});





//probas 
/* app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
}) */