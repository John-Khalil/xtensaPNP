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
        const storedData=userLocalStorage();
        storedData.machineList[userLocalStorage().selectedMachine][key]=value;
        localStorage.setItem(baseAddress,JSON.stringify(storedData));
        return JSON.parse(localStorage.getItem(baseAddress)).machineList[userLocalStorage().selectedMachine][key];
    },
    userLocalStorage 
}





const SERVICE_RUNNER='SERVICE_RUNNER';

const CONTROLPANEL_UNIT='CONTROLPANEL_UNIT';
const CONTROLPANEL_UNITZ='CONTROLPANEL_UNITZ';
const CONTROLPANEL_FEEDRATE='CONTROLPANEL_FEEDRATE';
const CONTROLPANEL_SELECTED_TOOL='CONTROLPANEL_SELECTED_TOOL';

const WEBSOCKET_REMOTE_HOST='WEBSOCKET_REMOTE_HOST';
const WEBSOCKET_REMOTE_PORT='WEBSOCKET_REMOTE_PORT';


const EXECUATABLE_SEND='EXECUATABLE_SEND';
const EXECUATABLE_REPORT_ACTION='EXECUATABLE_REPORT_ACTION';
const EXECUATABLE_REPORT_STATUS='EXECUATABLE_REPORT_STATUS';
const EXECUATABLE_PROCESS='EXECUATABLE_PROCESS';
const EXECUATABLE_RETURN='EXECUATABLE_RETURN';


export {
    CONTROLPANEL_UNIT,
    CONTROLPANEL_UNITZ,
    CONTROLPANEL_FEEDRATE,
    CONTROLPANEL_SELECTED_TOOL,
    EXECUATABLE_SEND,
    EXECUATABLE_REPORT_ACTION,
    EXECUATABLE_REPORT_STATUS,
    EXECUATABLE_PROCESS,
    EXECUATABLE_RETURN,
    WEBSOCKET_REMOTE_HOST,
    WEBSOCKET_REMOTE_PORT,
    SERVICE_RUNNER

}




const appLinker =new AppLinker;


export default appLinker;
