// import WebSocket from "ws";
import appLinker, { EXECUATABLE_RETURN, EXECUATABLE_SEND, userStorage, WEBSOCKET_CLIENT_SEND, WEBSOCKET_REMOTE_HOST, WEBSOCKET_REMOTE_PATH, WEBSOCKET_REMOTE_PORT } from "./utils";

export class webSocketConnection{
    static connectionList=[];

    constructor(payload){

        const networkData={
            ip:(payload||{}).ip||userStorage.get(WEBSOCKET_REMOTE_HOST)||userStorage.set(WEBSOCKET_REMOTE_HOST,'127.0.0.1'),
            port:(payload||{}).port||userStorage.get(WEBSOCKET_REMOTE_PORT)||userStorage.set(WEBSOCKET_REMOTE_PORT,'90'),
            path:(payload||{}).port||userStorage.get(WEBSOCKET_REMOTE_PATH)||userStorage.set(WEBSOCKET_REMOTE_PATH,'/')

        }

        if(webSocketConnection.connectionList.includes(JSON.stringify(networkData))){
            appLinker.send(WEBSOCKET_CLIENT_SEND,payload);
            return;
        }

        const socket = new WebSocket(`ws://${networkData.ip}:${networkData.port}${networkData.path}`);

        socket.addEventListener('open',()=>{
            webSocketConnection.connectionList.push(JSON.stringify(networkData));
            appLinker.addListener(WEBSOCKET_CLIENT_SEND,data=>{
                try{
                    socket.send(JSON.stringify(data));
                }
                catch(e){

                }
            });
            appLinker.send(WEBSOCKET_CLIENT_SEND,payload);  //^ send the first message
        });

        socket.addEventListener('message',(event)=>{
            appLinker.send(EXECUATABLE_RETURN,JSON.parse(event.data));
        });

        socket.addEventListener('close',()=>{
            webSocketConnection.connectionList.forEach((element,index)=>{
                if(element==JSON.stringify(networkData))
                    webSocketConnection.connectionList[index]='';
            })
        });

        socket.addEventListener('error',()=>{
            appLinker.send(EXECUATABLE_RETURN,JSON.parse({...payload,returnData:undefined,statusLabel:'NETWORK_ERROR'}));
        });


        
    }
}

const WebSocketSetup=()=>{
    // const socket = new WebSocket(`ws://${userStorage.get(WEBSOCKET_REMOTE_HOST)||userStorage.set(WEBSOCKET_REMOTE_HOST,'127.0.0.1')}:${userStorage.get(WEBSOCKET_REMOTE_PORT)||userStorage.set(WEBSOCKET_REMOTE_PORT,'90')}`);

    // socket.addEventListener('open',()=>{
    //     appLinker.addListener(EXECUATABLE_SEND,data=>{
    //         socket.send(JSON.stringify(data));
    //     })
    // });

    // socket.addEventListener('message',(event)=>{
    //     appLinker.send(EXECUATABLE_RETURN,JSON.parse(event.data));
    // });

    // socket.addEventListener('close',()=>{

    // });

    // socket.addEventListener('error',()=>{

    // });

    appLinker.addListener(EXECUATABLE_SEND,data=>{
        new webSocketConnection(data);
    })
}

export default WebSocketSetup;

