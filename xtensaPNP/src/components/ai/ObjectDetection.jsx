import React, { useState, useEffect, useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl"; // set backend to webgl

import ButtonHandler from "./components/btn-handler";
import { detectImage, detectVideo } from "./utils/detect";


const ObjectDetecion = ({userModel}) => {
  const imageRef = useRef(null);
  const cameraRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const classThreshold = (userModel.classThreshold||0.2);
  const videoSource=(userModel||{}).videoSource||undefined;

  const [multiModel,setMultiModel]=useState([]);
1
  useEffect(() => {
    tf.ready().then(async () => {

      const modelArrayBuffer=[];

      ((userModel||{}).models||[]).forEach((element,index) => {
          tf.loadGraphModel(
            `${window.location.origin}/${element.modelName}_web_model/model.json`,
            {
              onProgress: (fractions) => {
    
    
              },
            }
          ).then(async(elementModel)=>{

    
              const dummyInput = tf.ones(elementModel.inputs[0].shape);
              const warmupResult = await elementModel.executeAsync(dummyInput);
              tf.dispose(warmupResult);
              tf.dispose(dummyInput);
              modelArrayBuffer.push({ net: elementModel,inputShape: elementModel.inputs[0].shape});

                if(index==(userModel.models.length-1))
                  setMultiModel(modelArrayBuffer);
          });
      });      
    });
  }, []);

  setTimeout(() => {
    cameraRef.current.srcObject = (userModel||{}).videoSource||undefined;
  }, 50);

  let otherModels=[];
  // ((userModel||{}).otherModels||[]).forEach(element => {
  //   otherModels.push(
  //     <ObjectDetecion userModel={{
  //       canvasRef,
  //       cameraRef,
  //       otherModels:[],
  //       className:'hidden',
  //       videoSource:(userModel||{}).videoSource||undefined,

  //       modelName:element.modelName,
  //       labels:element.labels,
  //       classThreshold:element.modelName||classThreshold,
  //       onDetect:element.onDetect,

  //     }}/>
  //   );
  // });
  // setInterval(() => {
  //   console.log(multiModel)
  // }, 10000);

  return (
    <>
       <div className={(userModel||{}).className||''}>
        

        <div className="content">
          {/* <img
            src="#"
            ref={imageRef}
            onLoad={() => detectImage(imageRef.current, model, classThreshold, canvasRef.current)}
          /> */}
          <video
            autoPlay
            muted
            // srcObject ={videoSource}
            ref={cameraRef}
            onPlay={() => {
              if(multiModel.length){
                ((userModel||{}).models||[]).forEach(async (element,index) => {
                  detectVideo(((userModel||{}).cameraRef||cameraRef).current,multiModel[index] , element.classThreshold, ((userModel||{}).canvasRef||canvasRef).current,element);
                });
              } 
                
                
               
              }
            }
          />
          {/* <video
            autoPlay
            muted
            ref={videoRef}
            onPlay={() => detectVideo(videoRef.current, model, classThreshold, canvasRef.current)}
          /> */}
          <canvas width={(multiModel[0]!=undefined)?multiModel[0].inputShape[1]:0} height={(multiModel[0]!=undefined)?multiModel[0].inputShape[2]:0} ref={canvasRef} />
        </div>
      </div>
      {otherModels}
    </>
   
    
  );
};

export default ObjectDetecion;
