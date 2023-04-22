import chalk from "chalk";
import WebSocket,{WebSocketServer } from "ws";
import appLinker from "./utils.js";
import {execuatable} from "./utils.js";


const webSocketServerPort=90;

const WEBSOCKET_SERVER_DATA='WEBSOCKET_SERVER_DATA';
const WEBSOCKET_SERVER_SEND='WEBSOCKET_SERVER_SEND';

const EXECUATABLE_INPUT_DEVICE='inputDevice';
const EXECUATABLE_OUTPUT_DEVICE='outputDevice';
const EXECUATABLE_MOTION_CONTROLLER='motionController';

const USER_RETURN='USER_RETURN';


//^ REPLACE WITH WS CLIENT 

appLinker.addListener(EXECUATABLE_INPUT_DEVICE,data=>{
    setTimeout(() => {
        data.INPUT_VALUE=556;
        appLinker.send(USER_RETURN,data)
    }, 50);

});

appLinker.addListener(EXECUATABLE_OUTPUT_DEVICE,data=>{
    setTimeout(() => {
        data.ack=execuatable.OUTPUT_ACK;
        appLinker.send(USER_RETURN,data)
    }, 50);
});

appLinker.addListener(EXECUATABLE_MOTION_CONTROLLER,data=>{
    setTimeout(() => {
        data.ack=execuatable.MOTIONCONTROLLER_ACK;
        appLinker.send(USER_RETURN,data)
    }, 50);
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

appLinker.addListener(USER_RETURN,statusObject=>{
    appLinker.send(WEBSOCKET_SERVER_SEND,statusObject);
    execuatable.operatorReturn(statusObject);
});

execuatable.send=data=>appLinker.send(data.operator,data);


