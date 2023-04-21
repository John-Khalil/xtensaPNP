import axios from "axios";
export default class execuatable{
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

