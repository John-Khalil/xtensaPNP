import chalk from "chalk";
import WebSocket,{WebSocketServer } from "ws";
import appLinker, { EXECUATABLE_RETURN, MOTIONCONTROLLER_IP, MOTIONCONTROLLER_PATH, MOTIONCONTROLLER_PORT, userStorage, webSocketConnection } from "./utils.js";
import {execuatable} from "./utils.js";

import express  from "express";
import cors from 'cors';
import bodyParser, { json } from "body-parser";

console.clear();

const webSocketServerPort=90;

const WEBSOCKET_SERVER_DATA='WEBSOCKET_SERVER_DATA';
const WEBSOCKET_SERVER_SEND='WEBSOCKET_SERVER_SEND';

const EXECUATABLE_INPUT_DEVICE='inputDevice';
const EXECUATABLE_OUTPUT_DEVICE='outputDevice';
const EXECUATABLE_MOTION_CONTROLLER='motionController';

const USER_RETURN='EXECUATABLE_RETURN';

const CONTROLLER_IP='192.168.1.8';
const CONTROLLER_PORT='80';
const CONTROLLER_PATH='/'


//^ REPLACE WITH WS CLIENT 
//? we couldn't just add a single applinker event, cause of the diffrent connection types ws, telnet , etc..

appLinker.addListener(EXECUATABLE_MOTION_CONTROLLER,data=>{
  //! add telnet connection
  new webSocketConnection(data);
});

appLinker.addListener(EXECUATABLE_OUTPUT_DEVICE,data=>{
  
  new webSocketConnection(data);
});

appLinker.addListener(EXECUATABLE_INPUT_DEVICE,data=>{
  
  new webSocketConnection(data);
});










const server =new  WebSocketServer({ port: webSocketServerPort });


server.on('connection', (socket) => {
  console.log('Client connected');


  socket.on('message', (message) => {
    appLinker.send(WEBSOCKET_SERVER_DATA,JSON.parse(message));
  });

  appLinker.addListener(WEBSOCKET_SERVER_SEND,data=>{
    socket.send(JSON.stringify(data));
  });

  // listen for when the client disconnects
  socket.on('close', () => {
    console.log('Client disconnected');
  });
});


appLinker.addListener(WEBSOCKET_SERVER_DATA,data=>{
    new execuatable(data);
});

appLinker.addListener(EXECUATABLE_RETURN,statusObject=>{
    appLinker.send(WEBSOCKET_SERVER_SEND,statusObject);
    execuatable.operatorReturn(statusObject);
});

execuatable.send=data=>appLinker.send(data.operator,data);


const appListenerPort=webSocketServerPort+1;
var app=express();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());


app.use(express.json());

app.post('/',(req,res)=>{
  if(((req||{}).body||{}).requestType=='SERVER_CONFIG'){
    res.send(JSON.stringify(userStorage.storage(((req||{}).body||{}).serverConfig)))
    return;
  }
  res.send(JSON.stringify({}))
})

app.listen(appListenerPort,()=>{
  console.log("-- http server started--");
});