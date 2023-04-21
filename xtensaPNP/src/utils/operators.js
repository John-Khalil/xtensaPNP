import axios from "axios";
export default class execuatable{
    static send=()=>{};

    static operatorCallBack={
        motionController:async(operatorObject)=>{

        },
        inputDevice:async(operatorObject)=>{

        },
        outputDevice:async(operatorObject)=>{

        },
        thread:async(operatorObject)=>{

        }
    }
    
    static operatorReturn=(statusObject)=>{
        Object.keys(execuatable.operatorCallBack).forEach(callBack=>execuatable.operatorCallBack[callBack](statusObject));
    }

    operators={
        motionController:(operatorObject)=>{
            execuatable.send(operatorObject);
        },
        inputDevice:(operatorObject)=>{

        },
        outputDevice:(operatorObject)=>{
            execuatable.send(operatorObject);
        },
        thread:(operatorObject)=>{
            // console.log(this)
            execuatable.operatorCallBack.thread=statusObject=>{
                if(statusObject.ack=='threadLoad'){
                    new execuatable({
                        operator:operatorObject.operator,
                        execuatableList:operatorObject.execuatableList.slice(1)
                    });
                }
            }
            new execuatable(operatorObject.execuatableList[0]);
        }
    }

    constructor(operatorObject){
        if(typeof operatorObject === 'function'){
            console.log('manga')
            this.send=operatorObject;
            return;
        }    
        this.operators[operatorObject.operator](operatorObject);
    }
}

