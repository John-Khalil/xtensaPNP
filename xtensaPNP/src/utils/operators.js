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


export class pipeline {
    //^ keys

    static STATUS_LABEL=        "statusLabel";
    static INPUT_VALUE=         "INPUT_VALUE";
    static RETURN_DATA=         "returnData";
    static OPERATOR=            "operator";
    static ID=                  "ID";
    static ACK=                 "ack";
    static CHANNEL=             "ch";
    static VALUE=               "value";
    static THREAD_ACK=          "THREAD_ACK";
    static INPUT_VALUE=         "INPUT_VALUE";
    static OUTPUT_ACK=          "OUTPUT_ACK";
    static MOTIONCONTROLLER_ACK="MOTIONCONTROLLER_ACK";
    static EXECUTABLE_LIST=     "execuatableList";
    static G_CODE=              "gcode";

    static INPUT_DEVICE=        "inputDevice"
    static OUTPUT_DEVICE=       "outputDevice"
    static MOTION_CONTROLLER=   "motionController"
    static THREAD=              "thread"
    static PIN_MODE=            "pinMode"
    static INPUT_REGISTER_0=    "inputRegister0"
    static INPUT_REGISTER_1=    "inputRegister1"
    static OUTPUT_REGISTER_0=   "outputRegister0"
    static OUTPUT_REGISTER_1=   "outputRegister1"
    static PWM=                 "pwm"
    static ANALOG_INPUT=        "analogInput"
    static DIGITAL_INPUT=       "digitalInput"
    static DIGITAL_OUTPUT=      "digitalOutput"
    static SERVO_CONTROL=       "servoControl"
    static CLOCK_OUTPUT=        "clockOutput"
    static EXTENDED_OUTPUT=     "extendedOutput"
    static EXECUTABLE_OBJECT=   "executableObject"

    threadLoader={
        [this.OPERATOR]:execuatable.EXECUATABLE_THREAD,
        [this.EXECUTABLE_LIST]:[]
    }

    
    run=()=>{
        appLinker.send(EXECUATABLE_PROCESS,this.threadLoader);
        this.threadLoader[pipeline.EXECUTABLE_LIST]=[];
        return this;
    }

    runAsync=()=>{
        execuatable.send(this.threadLoader);
        this.threadLoader[pipeline.EXECUTABLE_LIST]=[];
        return this;
    }

    analogRead=(channel,onData)=>{
        this.threadLoader[pipeline.EXECUTABLE_LIST].push({
            [pipeline.OPERATOR]:execuatable.EXECUATABLE_INPUT_DEVICE,
            [pipeline.ID]:pipeline.ANALOG_INPUT,
            [pipeline.CHANNEL]:channel,
            [pipeline.INPUT_DEVICE]:onData
        })
        return this;
    }

    servoControl=(channel,value)=>{
        this.threadLoader[pipeline.EXECUTABLE_LIST].push({
            [pipeline.OPERATOR]:execuatable.EXECUATABLE_OUTPUT_DEVICE,
            [pipeline.ID]:pipeline.SERVO_CONTROL,
            [pipeline.CHANNEL]:channel,
            [pipeline.VALUE]:value
        })
        return this;
    }

    outputPort0=(channel,value)=>{
        this.threadLoader[pipeline.EXECUTABLE_LIST].push({
            [pipeline.OPERATOR]:execuatable.EXECUATABLE_OUTPUT_DEVICE,
            [pipeline.ID]:pipeline.DIGITAL_OUTPUT,
            [pipeline.CHANNEL]:(value==undefined)?(0x280):(channel|0x80),
            [pipeline.VALUE]:(value==undefined)?(channel):(value)
        })
        return this;
    }

    outputPort1=(channel,value)=>{
        this.threadLoader[pipeline.EXECUTABLE_LIST].push({
            [pipeline.OPERATOR]:execuatable.EXECUATABLE_OUTPUT_DEVICE,
            [pipeline.ID]:pipeline.DIGITAL_OUTPUT,
            [pipeline.CHANNEL]:(value==undefined)?(0x300):(channel|0x100),
            [pipeline.VALUE]:(value==undefined)?(channel):(value)
        })
        return this;
    }

    gcode=(command)=>{
        this.threadLoader[pipeline.EXECUTABLE_LIST].push({
            [pipeline.OPERATOR]:execuatable.EXECUATABLE_MOTION_CONTROLLER,
            [pipeline.G_CODE]:command
        })
        return this;
    }


    constructor(){
        return this;
    }



}