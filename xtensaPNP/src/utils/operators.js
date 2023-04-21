export default class execuatable{
    operators={
        motionController:operatorObject=>{

        },
        inputDevice:operatorObject=>{

        },
        outputDevice:operatorObject=>{

        },
        thread:operatorObject=>{

        },
        condition:operatorObject=>{

        }

    }

    constructor(operatorObject){
        this.operators[operatorObject.operator](operatorObject);
    }
}