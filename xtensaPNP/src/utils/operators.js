import axios from "axios";
export default class execuatable{
    operators={
        motionController:async(operatorObject)=>{
            console.log("operatorObject >> ",operatorObject);
        },
        inputDevice:async(operatorObject)=>{
            const response =await axios.get('https://raw.githubusercontent.com/engkhalil/xtensa32plus/main/dnsSquared.json');
            console.log("response.data >> ",response.data);
            return response.data;
        },
        outputDevice:async(operatorObject)=>{

        },
        thread:async(operatorObject)=>{
            (((operatorObject||{}).execuatableList)||[]).forEach(execuatableOperator => {
                new execuatable(execuatableOperator);
            });
        },
        condition:async(operatorObject)=>{

        }

    }

    constructor(operatorObject){
        this.operators[operatorObject.operator](operatorObject);
    }
}

