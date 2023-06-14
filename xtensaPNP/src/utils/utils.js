export class AppLinker{
    usersList=[];

    addListener=(identifier, callBack)=>(this.usersList[identifier]||(this.usersList[identifier]=[])).push(callBack);

    send=(identifier, data)=>(this.usersList[identifier]||[]).map(callBack => {
        callBack(data);
    });
    
}

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
        appLinker.send(USER_SETTIGNS_LIVE_RELOAD,{});
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

const MAIN_IP='127.0.0.1';
const MAIN_PORT='90';
const MAIN_HTTP_PORT='91';
const MAIN_PATH='/'; 

const HTTP_SERVER_ADDRESS='HTTP_SERVER_ADDRESS';
const HTTP_SERVER_PORT='HTTP_SERVER_PORT';
const HTTP_SERVER_PATH='HTTP_SERVER_PATH';

const USER_SETTIGNS_LIVE_RELOAD='USER_SETTIGNS_LIVE_RELOAD';

const PARTS_LIST='partsList';


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
    MAIN_HTTP_PORT,
    MAIN_PATH,

    HTTP_SERVER_ADDRESS,
    HTTP_SERVER_PORT,
    HTTP_SERVER_PATH,
    USER_SETTIGNS_LIVE_RELOAD,

    PARTS_LIST,



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



const appLinker =new AppLinker;


export default appLinker;
