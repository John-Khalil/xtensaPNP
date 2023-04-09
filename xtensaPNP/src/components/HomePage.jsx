import React, { useState, useEffect, useRef } from "react";
import ObjectDetecion from './ai/ObjectDetection'
import { DynamicConsole } from "./ConsoleDynamic";

import ReactModal from 'react-modal';


export default function HomePage() {
  const [videoSource,setVideoSource]=useState(undefined);

  useEffect(()=>{
    navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
      setVideoSource(stream);
      // videoRef.current.srcObject = stream;
    })
    .catch((error) => {
      console.error(error);
    });

    setTimeout(() => {
      setVideoSource(undefined);
    }, 200000);

    // setVideoSource('http://192.168.1.6:8080/videofeed');
  },[]);


  return (
    <>
      {/* <ReactModal isOpen={true} contentElement={
        (props, children) => <div {...props}>{children}</div>
      }>
        <>
        <div className="bg-fuchsia-400"> test</div>
        </>
      </ReactModal> */}


      <div className="border border-fuchsia-700 rounded-lg m-1 p-1 h-[950px]">




        <ObjectDetecion userModel={{
            videoSource,
            className:'',
            models:[
              {
                modelName:'broken_traces',
                labels:['missing_hole', 'mouse_bite','open_circuit', 'short', 'spur', 'spurious_copper'],
                classThreshold : 0.01,
                enable:false,
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
                classThreshold : 0.01,
                enable:false
              }
            ]
          }}/>

      
        </div>

      <div className=" text center ">

          

        <DynamicConsole userConsole={{
          className:'lg:w-[calc(100% -16)] ',
          // consoleInput:true,
          // clearConsole:true,
          themeColor:'#a11caf',
          height:290,
          // consoleData:consoleLog,
          // send:getConsoleInput,
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
