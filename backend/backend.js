import WebSocket from "ws";

const webSocketServerPort=90;

const WEBSOCKET_SERVER_DATA='WEBSOCKET_SERVER_DATA';
const WEBSOCKET_SERVER_SEND='WEBSOCKET_SERVER_SEND';

const EXECUATABLE_INPUT_DEVICE='inputDevice';
const EXECUATABLE_OUTPUT_DEVICE='outputDevice';
const EXECUATABLE_MOTION_CONTROLLER='motionController';

const USER_RETURN='USER_RETURN';



class AppLinker{
    usersList=[];

    addListener=(identifier, callBack)=>(this.usersList[identifier]||(this.usersList[identifier]=[])).push(callBack);

    send=(identifier, data)=>(this.usersList[identifier]||[]).map(callBack => {
        callBack(data);
    });
    
}


class execuatable{
    static send=()=>{};
    static reportAction=()=>{};
    static reportStatus=()=>{};

    static THREAD_ACK='THREAD_ACK';
    static INPUT_VALUE='INPUT_VALUE';
    static OUTPUT_ACK='OUTPUT_ACK';
    static MOTIONCONTROLLER_ACK='MOTIONCONTROLLER_ACK';


    static operatorCallBack={
        motionController:(statusObject)=>{
            if(statusObject.ack==execuatable.MOTIONCONTROLLER_ACK){
                statusObject.ack=execuatable.THREAD_ACK;
                execuatable.operatorCallBack.thread(statusObject);
            }
        },
        inputDevice:(statusObject)=>{

        },
        outputDevice:(statusObject)=>{
            if(statusObject.ack==execuatable.OUTPUT_ACK){
                statusObject.ack=execuatable.THREAD_ACK;
                execuatable.operatorCallBack.thread(statusObject);
            }
        },
        thread:(statusObject)=>{

        }
    }
    
    static operatorReturn=(statusObject)=>{
        Object.keys(execuatable.operatorCallBack).forEach(callBack=>execuatable.operatorCallBack[callBack](statusObject));
    }

    operators={
        motionController:(operatorObject)=>{
            execuatable.reportAction(operatorObject);
            execuatable.send(operatorObject);
        },
        inputDevice:(operatorObject)=>{
            execuatable.reportAction(operatorObject);
            execuatable.operatorCallBack.inputDevice=statusObject=>{
                if(statusObject.INPUT_VALUE==undefined){
                    (operatorObject.inputDevice||(()=>{}))(statusObject.INPUT_VALUE);
                    statusObject.ack=execuatable.THREAD_ACK;
                    execuatable.operatorCallBack.thread(statusObject);
                }
            }
            execuatable.send(operatorObject);
        },
        outputDevice:(operatorObject)=>{
            execuatable.reportAction(operatorObject);
            execuatable.send(operatorObject);
        },
        thread:(operatorObject)=>{
            // console.log(this)
            execuatable.operatorCallBack.thread=statusObject=>{
                if(statusObject.ack==execuatable.THREAD_ACK){
                    new execuatable({
                        operator:operatorObject.operator,
                        execuatableList:operatorObject.execuatableList.slice(1)
                    });
                }
                else{
                    execuatable.reportStatus(statusObject);
                }
            }
            new execuatable(operatorObject.execuatableList[0]||{});
        }
    }

    constructor(operatorObject){
        if(typeof operatorObject === 'function'){
            console.log('manga')
            this.send=operatorObject;
            return;
        }
        if(operatorObject!=={})    
            this.operators[operatorObject.operator](operatorObject);
    }
}

// const execuatableSetup=()=>{
//     appLinker.addListener(EXECUATABLE_PROCESS,async(data)=>{
//         new execuatable(data);
//     });

//     appLinker.addListener(EXECUATABLE_RETURN,async(data)=>{
//         execuatable.operatorReturn(data);
//     });
    
    
//     execuatable.send=data=>appLinker.send(EXECUATABLE_SEND,data);
//     execuatable.reportAction=data=>appLinker.send(EXECUATABLE_REPORT_ACTION,data);
//     execuatable.reportStatus=data=>appLinker.send(EXECUATABLE_REPORT_STATUS,data);

// }

const appLinker =new AppLinker;





const server = new WebSocket.Server({ port: webSocketServerPort });


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


