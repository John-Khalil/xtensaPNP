import React, { useState, useEffect, useRef } from "react";
import ObjectDetecion from './ai/ObjectDetection'
import { DynamicConsole } from "./ConsoleDynamic";

export default function HomePage() {
  const [videoSource,setVideoSource]=useState(undefined);
  useEffect(()=>{
    navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
      // setVideoSource(stream);
      // videoRef.current.srcObject = stream;
    })
    .catch((error) => {
      console.error(error);
    });

    setTimeout(() => {
      setVideoSource(undefined);
    }, 200000);
  },[]);








  const [consoleLog,consoleLogger]=useState(<>
		<div className="bg-fuchsia-400"> test</div>
	</>);
	let testCounter=0;
	const getConsoleInput=(consoleInput)=>{
		console.log(consoleInput.consoleIdentifier);
		consoleLogger(consoleInput.consoleData);
		setTimeout(() => {
			consoleLogger(undefined);
		}, 0);
	}

  

  return (
    <>


      <ObjectDetecion userModel={{
          videoSource,
          className:'',
          models:[
            {
              modelName:'broken_traces',
              labels:['missing_hole', 'mouse_bite','open_circuit', 'short', 'spur', 'spurious_copper'],
              classThreshold : 0.01,
              onDetect:(res)=>{
                const [boxes, scores, classes] = res.slice(0, 3);
                const boxes_data = boxes.dataSync();
                const scores_data = scores.dataSync();
                const classes_data = classes.dataSync();
                // console.log([boxes_data,scores_data,classes_data]);
              },
            },
            {
              modelName:'components',
              labels:['capacitor', 'inductor', 'resistor'],
              classThreshold : 0.01
            }
          ]
      }}/>

      

      <div className=" text center">

          

        <DynamicConsole userConsole={{
          className:'lg:w-[calc(100% -16)] ',
          // consoleInput:true,
          // clearConsole:true,
          themeColor:'#a11caf',
          height:200,
          consoleData:consoleLog,
          send:getConsoleInput,
          hide:false,
          consoleIdentifier:'ALL-EVENTS',
          textColor:'#00ff00',
          // themeColor:'rgb(0,0,0)'
          
          
        }}/>
      
      </div>
      {/* <ObjectDetecion userModel={{
          videoSource,
          modelName:'components',
          labels:['capacitor', 'inductor', 'resistor'],
          classThreshold : 0.01
      }}/> */}
    
    </>
  )
}
