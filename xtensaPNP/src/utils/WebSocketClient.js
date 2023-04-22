// import WebSocket from "ws";
import appLinker, { EXECUATABLE_RETURN, EXECUATABLE_SEND, userStorage, WEBSOCKET_REMOTE_HOST, WEBSOCKET_REMOTE_PORT } from "./utils";

const WebSocketSetup=()=>{
    const socket = new WebSocket(`ws://${userStorage.get(WEBSOCKET_REMOTE_HOST)||userStorage.set(WEBSOCKET_REMOTE_HOST,'127.0.0.1')}:${userStorage.get(WEBSOCKET_REMOTE_PORT)||userStorage.set(WEBSOCKET_REMOTE_PORT,'90')}`);

    socket.addEventListener('open',()=>{
        appLinker.addListener(EXECUATABLE_SEND,data=>{
            socket.send(JSON.stringify(data));
        })
    });

    socket.addEventListener('message',(event)=>{
        appLinker.send(EXECUATABLE_RETURN,JSON.parse(event.data));
    });

    socket.addEventListener('close',()=>{

    });

    socket.addEventListener('error',()=>{

    });
}

export default WebSocketSetup;