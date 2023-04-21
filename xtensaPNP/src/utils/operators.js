import axios from "axios";
export default class execuatable{
    operators={
        motionController:async(operatorObject)=>{
            console.log("operatorObject >> ",operatorObject);
        },
        inputDevice:async(operatorObject)=>{
            const response =await axios.post(`http://${(operatorObject||{}).ipAddress||'127.0.0.1'}:${(operatorObject||{}).port||'80'}/`,operatorObject);


            // const response = await fetch(`http://${(operatorObject||{}).ipAddress||'127.0.0.1'}:${(operatorObject||{}).port||'80'}`, {
            //     method: "POST", // *GET, POST, PUT, DELETE, etc.
            //     mode: "cors", // no-cors, *cors, same-origin
            //     cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            //     credentials: "same-origin", // include, *same-origin, omit
            //     headers: {
            //       "Content-Type": "application/json",
            //       // 'Content-Type': 'application/x-www-form-urlencoded',
            //     },
            //     redirect: "follow", // manual, *follow, error
            //     referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            //     body: JSON.stringify(operatorObject), // body data type must match "Content-Type" header
            //   });




            console.log("response.data >> ",response.data);
            // return response.data;
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

