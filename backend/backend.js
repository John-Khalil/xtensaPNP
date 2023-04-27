import chalk from "chalk";
import WebSocket,{WebSocketServer } from "ws";
import appLinker, { EXECUATABLE_RETURN, MOTIONCONTROLLER_IP, MOTIONCONTROLLER_PATH, MOTIONCONTROLLER_PORT, userStorage, webSocketConnection } from "./utils.js";
import {execuatable} from "./utils.js";

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
  const networkData={
    ip:userStorage.get(MOTIONCONTROLLER_IP)||userStorage.set(MOTIONCONTROLLER_IP,CONTROLLER_IP),
    port:userStorage.get(MOTIONCONTROLLER_PORT)||userStorage.set(MOTIONCONTROLLER_PORT,CONTROLLER_PORT),
    path:userStorage.get(MOTIONCONTROLLER_PATH)||userStorage.set(MOTIONCONTROLLER_PATH,CONTROLLER_PATH)
  }
  new webSocketConnection({...data,...networkData});
});

appLinker.addListener(EXECUATABLE_OUTPUT_DEVICE,data=>{
  const networkData={
    ip:userStorage.get(`${(data||{}).ID||''}_IP`)||userStorage.set(`${(data||{}).ID||''}_IP`,CONTROLLER_IP),
    port:userStorage.get(`${(data||{}).ID||''}_PORT`)||userStorage.set(`${(data||{}).ID||''}_PORT`,CONTROLLER_PORT),
    path:userStorage.get(`${(data||{}).ID||''}_PATH`)||userStorage.set(`${(data||{}).ID||''}_PATH`,CONTROLLER_PATH)
  }
  new webSocketConnection({...data,...networkData});
});

appLinker.addListener(EXECUATABLE_INPUT_DEVICE,data=>{
  const networkData={
    ip:userStorage.get(`${(data||{}).ID||''}_IP`)||userStorage.set(`${(data||{}).ID||''}_IP`,CONTROLLER_IP),
    port:userStorage.get(`${(data||{}).ID||''}_PORT`)||userStorage.set(`${(data||{}).ID||''}_PORT`,CONTROLLER_PORT),
    path:userStorage.get(`${(data||{}).ID||''}_PATH`)||userStorage.set(`${(data||{}).ID||''}_PATH`,CONTROLLER_PATH)
  }
  new webSocketConnection({...data,...networkData});
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


