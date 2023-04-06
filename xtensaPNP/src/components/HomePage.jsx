import React, { useState, useEffect, useRef } from "react";
import ObjectDetecion from './ai/ObjectDetection'

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
  },[]);

  

  return (
    <>
      <div>HomePage</div>


      <ObjectDetecion userModel={{
          videoSource,
          modelName:'broken_traces',
          labels:['missing_hole', 'mouse_bite','open_circuit', 'short', 'spur', 'spurious_copper'],
          classThreshold : 0.01,
          className:'',
          onDetect:(res)=>{
            const [boxes, scores, classes] = res.slice(0, 3);
            const boxes_data = boxes.dataSync();
            const scores_data = scores.dataSync();
            const classes_data = classes.dataSync();
            console.log([boxes_data,scores_data,classes_data]);
          }
      }}/>
      
    
    </>
  )
}
