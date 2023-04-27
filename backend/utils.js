import WebSocket from "ws";
import { LocalStorage } from "node-localstorage";

const localStorage = new LocalStorage('./scratch');

export class AppLinker{
    usersList=[];

    addListener=(identifier, callBack)=>(this.usersList[identifier]||(this.usersList[identifier]=[])).push(callBack);

    send=(identifier, data)=>(this.usersList[identifier]||[]).map(callBack => {
        callBack(data);
    });
    
}

const appLinker =new AppLinker;

export default appLinker;


const baseAddress='xtensaPNP';

const userLocalStorage=()=>{
    if(localStorage.getItem(baseAddress)==null)
        localStorage.setItem(baseAddress,JSON.stringify({
            selectedMachine:0,
            machineList:[{}]
        }));
    return JSON.parse(localStorage.getItem(baseAddress));
}

export const userStorage={
    get:key=>{
        return(userLocalStorage().machineList[userLocalStorage().selectedMachine][key]);
    },
    selectMachine:(selectedMachine)=>{
        const storedData=userLocalStorage();
        storedData.selectedMachine=selectedMachine;
        localStorage.setItem(baseAddress,JSON.stringify(storedData));
        return JSON.parse(localStorage.getItem(baseAddress)).selectedMachine;
    },
    addMachine:(machineID)=>{
        const storedData=userLocalStorage();
        storedData.machineList.push({machineID});
        localStorage.setItem(baseAddress,JSON.stringify(storedData));
        return JSON.parse(localStorage.getItem(baseAddress)).machineList;
    },
    set:(key,value)=>{
        const storedData=userLocalStorage();
        storedData.machineList[userLocalStorage().selectedMachine][key]=value;
        localStorage.setItem(baseAddress,JSON.stringify(storedData));
        return JSON.parse(localStorage.getItem(baseAddress)).machineList[userLocalStorage().selectedMachine][key];
    },
    storage:(storageData)=>{
        if(storageData!=undefined)
            localStorage.setItem(baseAddress,JSON.stringify(storageData));
        return JSON.parse(localStorage.getItem(baseAddress));
    },
    userLocalStorage
}




const SERVICE_RUNNER='SERVICE_RUNNER';

const CONTROLPANEL_UNIT='CONTROLPANEL_UNIT';
const CONTROLPANEL_UNITZ='CONTROLPANEL_UNITZ';
const CONTROLPANEL_FEEDRATE='CONTROLPANEL_FEEDRATE';
const CONTROLPANEL_FEEDRATE_MAX='CONTROLPANEL_FEEDRATE_MAX';
const CONTROLPANEL_SELECTED_TOOL='CONTROLPANEL_SELECTED_TOOL';

const SPINDEL_RPM='SPINDEL_RPM';
const SPINDEL_RPM_MAX='SPINDEL_RPM_MAX';

const PUMP_POWER='PUMP_POWER';
const PUMP_POWER_MAX='PUMP_POWER_MAX';



const WEBSOCKET_CLIENT_SEND='WEBSOCKET_CLIENT_SEND';


const EXECUATABLE_SEND='EXECUATABLE_SEND';
const EXECUATABLE_REPORT_ACTION='EXECUATABLE_REPORT_ACTION';
const EXECUATABLE_REPORT_STATUS='EXECUATABLE_REPORT_STATUS';
const EXECUATABLE_PROCESS='EXECUATABLE_PROCESS';
const EXECUATABLE_RETURN='EXECUATABLE_RETURN';






const WEBSOCKET_REMOTE_HOST='WEBSOCKET_REMOTE_HOST';
const WEBSOCKET_REMOTE_PORT='WEBSOCKET_REMOTE_PORT';
const WEBSOCKET_REMOTE_PATH='WEBSOCKET_REMOTE_PATH';

const CAMERA_CONFIG='CAMERA_CONFIG';

const MOTIONCONTROLLER_IP='MOTIONCONTROLLER_IP';
const MOTIONCONTROLLER_PORT='MOTIONCONTROLLER_PORT';
const MOTIONCONTROLLER_PATH='MOTIONCONTROLLER_PATH';

const CONTROLLERS_LIST='CONTROLLERS_LIST';

const MAIN_IP='192.168.1.8';
const MAIN_PORT='80';
const MAIN_PATH='/'; 


export {
    CONTROLPANEL_UNIT,
    CONTROLPANEL_UNITZ,
    CONTROLPANEL_FEEDRATE,
    CONTROLPANEL_FEEDRATE_MAX,
    CONTROLPANEL_SELECTED_TOOL,

    SPINDEL_RPM,
    SPINDEL_RPM_MAX,

    PUMP_POWER,
    PUMP_POWER_MAX,

    EXECUATABLE_SEND,
    EXECUATABLE_REPORT_ACTION,
    EXECUATABLE_REPORT_STATUS,
    EXECUATABLE_PROCESS,
    EXECUATABLE_RETURN,

    WEBSOCKET_REMOTE_HOST,
    WEBSOCKET_REMOTE_PORT,
    WEBSOCKET_REMOTE_PATH,

    WEBSOCKET_CLIENT_SEND,


    MOTIONCONTROLLER_IP,
    MOTIONCONTROLLER_PORT,
    MOTIONCONTROLLER_PATH,

    CONTROLLERS_LIST,

    CAMERA_CONFIG,

    MAIN_IP,
    MAIN_PORT,
    MAIN_PATH,



    SERVICE_RUNNER

}


export const getNetworkData=(deviceID)=>{
    return userStorage.get(deviceID)||userStorage.set(deviceID,(
        userStorage.get(CONTROLLERS_LIST)||userStorage.set(CONTROLLERS_LIST,{
            selectedController:0,
            CONTROLLERS_LIST:[{
                ip:userStorage.get(WEBSOCKET_REMOTE_HOST)||userStorage.set(WEBSOCKET_REMOTE_HOST,MAIN_IP),
                port:userStorage.get(WEBSOCKET_REMOTE_PORT)||userStorage.set(WEBSOCKET_REMOTE_PORT,MAIN_PORT),
                path:userStorage.get(WEBSOCKET_REMOTE_PATH)||userStorage.set(WEBSOCKET_REMOTE_PATH,MAIN_PATH)
            }]
        })
    ).CONTROLLERS_LIST[userStorage.get(CONTROLLERS_LIST).selectedController]);
}





export class execuatable{
    static send=()=>{};
    static reportAction=()=>{};
    static reportStatus=()=>{};

    static THREAD_ACK='THREAD_ACK';
    static INPUT_VALUE='INPUT_VALUE';
    static OUTPUT_ACK='OUTPUT_ACK';
    static MOTIONCONTROLLER_ACK='MOTIONCONTROLLER_ACK';

    static EXECUATABLE_INPUT_DEVICE='inputDevice';
    static EXECUATABLE_OUTPUT_DEVICE='outputDevice';
    static EXECUATABLE_MOTION_CONTROLLER='motionController';
    static EXECUATABLE_THREAD='thread';


    static operatorCallBack={
        motionController:(statusObject)=>{
            if(statusObject.ack==execuatable.MOTIONCONTROLLER_ACK){

                // statusObject.ack=execuatable.THREAD_ACK;
                execuatable.operatorCallBack.thread({ack:execuatable.THREAD_ACK});
            }
        },
        inputDevice:(statusObject)=>{

        },
        outputDevice:(statusObject)=>{
            if(statusObject.ack==execuatable.OUTPUT_ACK){

                // statusObject.ack=execuatable.THREAD_ACK;
                execuatable.operatorCallBack.thread({ack:execuatable.THREAD_ACK});
            }
        },
        thread:(statusObject)=>{
            if(statusObject.ack!=execuatable.THREAD_ACK){
                execuatable.reportStatus(statusObject);
            }
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
                if(statusObject.INPUT_VALUE!=undefined){
                    (operatorObject.inputDevice||(()=>{}))(statusObject.INPUT_VALUE);

                    // statusObject.ack=execuatable.THREAD_ACK;
                    execuatable.operatorCallBack.thread({ack:execuatable.THREAD_ACK});
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
            this.send=operatorObject;
            return;
        }
        if(Object.keys(operatorObject).length!=0)    
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


export class webSocketConnection{
    static connectionList=[];


    constructor(payload){

        const networkData=((payload||{}).ID==undefined)?{
            ip:(payload||{}).ip||userStorage.get(WEBSOCKET_REMOTE_HOST)||userStorage.set(WEBSOCKET_REMOTE_HOST,MAIN_IP),
            port:(payload||{}).port||userStorage.get(WEBSOCKET_REMOTE_PORT)||userStorage.set(WEBSOCKET_REMOTE_PORT,MAIN_PORT),
            path:(payload||{}).port||userStorage.get(WEBSOCKET_REMOTE_PATH)||userStorage.set(WEBSOCKET_REMOTE_PATH,MAIN_PATH)

        }:getNetworkData(payload.ID);

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
            appLinker.send(EXECUATABLE_RETURN,{...payload,returnData:undefined,statusLabel:'NETWORK_ERROR'});
        });


        
    }
}

export const WebSocketSetup=()=>{
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

    //^ init settings

    appLinker.send(EXECUATABLE_SEND,{
        operator:execuatable.EXECUATABLE_OUTPUT_DEVICE,
        ID:'init'
    })
}

