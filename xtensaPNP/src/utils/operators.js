import axios from "axios";
import appLinker, { EXECUATABLE_PROCESS, EXECUATABLE_REPORT_ACTION, EXECUATABLE_REPORT_STATUS, EXECUATABLE_RETURN, EXECUATABLE_SEND } from "./utils";
export default class execuatable{
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

export const execuatableSetup=()=>{
    appLinker.addListener(EXECUATABLE_PROCESS,async(data)=>{
        new execuatable(data);
    });

    appLinker.addListener(EXECUATABLE_RETURN,async(data)=>{
        
        execuatable.operatorReturn(data);
    });
    
    
    execuatable.send=data=>appLinker.send(EXECUATABLE_SEND,data);
    execuatable.reportAction=data=>appLinker.send(EXECUATABLE_REPORT_ACTION,data);
    execuatable.reportStatus=data=>appLinker.send(EXECUATABLE_REPORT_STATUS,data);

    //^ only for a demo

    appLinker.addListener(EXECUATABLE_REPORT_ACTION,data=>{
        console.log(' ---> ',data);
    });

    appLinker.addListener(EXECUATABLE_REPORT_STATUS,data=>{
        console.log(' <--- ',data);
    });

}