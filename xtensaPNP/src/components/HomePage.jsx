import React, { useState, useEffect, useRef } from "react";
import ObjectDetecion from './ai/ObjectDetection'
import { DynamicConsole } from "./ConsoleDynamic";
import appLinker from '../utils/utils'
import AppModal from "./AppModal";
import ReactModal from 'react-modal';
import FramePreview from "./ai/FramePreview";


export default function HomePage() {
  const [videoSource,setVideoSource]=useState(undefined);
  const [allEventsData,allEventsLog]=useState('');

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

    
    appLinker.addListener('ALL-EVENTS',async(data)=>{
      allEventsLog(data)
    });



  },[]);



  return (
    <>
      <AppModal identifier={''}/>


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
                  // console.log("res >> ",res);

                  appLinker.send('ALL-EVENTS',
                    <>
                      <div className="bg-gray-700 text-orange-300"> shit happened !! <button className="text-red-500" onClick={()=>{
                        appLinker.send('@AppModal-setContent',
                          <FramePreview objectDetcted={{...res,onApprove:()=>{}}}/>
                        );
                        appLinker.send('@AppModal-setOpen',true);
                      }}> click here to learn more </button> </div>
                    </>
                  );
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
          height:280,
          consoleData:allEventsData,
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
