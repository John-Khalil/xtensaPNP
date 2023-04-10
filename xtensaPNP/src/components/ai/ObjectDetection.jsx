import React, { useState, useEffect, useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl"; // set backend to webgl

import ButtonHandler from "./components/btn-handler";
import { detectImage, detectVideo } from "./utils/detect";
import { useLayoutEffect } from "react";
import appLinker from "../../utils/utils";

const ObjectDetecion = ({userModel}) => {
  
  const imageRef = useRef(null);
  const cameraRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  const classThreshold = (userModel.classThreshold||0.2);
  const videoSource=(userModel||{}).videoSource||undefined;
  
  const [multiModel,setMultiModel]=useState([]);
  
  const [divMargin,setDivMargin]=useState(0);
  const contentDiv=useRef(null);


  const [modelCheckList,setModelCheckList]=useState([]);
  let [userEnabledModels,setUserEnabledModels]=useState(((userModel||{}).models||[]));
  
  
  useEffect(() => {
    tf.ready().then(async () => {
      
      const modelArrayBuffer=[];
      const modelCheckListArrayBuffer=[];





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

                if(index==(userModel.models.length-1)){
                  setMultiModel(modelArrayBuffer);
                  setModelCheckList(modelCheckListArrayBuffer);
                }
          });

          modelCheckListArrayBuffer.push(<>
            <span>{element.modelName}</span><input className="float-right mt-2"  type="checkbox" onChange={event=>{

              ((userModel||{}).models||[])[index].enable=event.target.checked;
              userEnabledModels=((userModel||{}).models||[]);
              setUserEnabledModels(((userModel||{}).models||[]));
            }}/><br />
          </>);
          
          

      });      
    });

    appLinker.send('ALL-EVENTS',<>
      <div className="bg-gray-700"> test Manga</div>
    </>);

  }, []);


  setTimeout(() => {
    cameraRef.current.srcObject = (userModel||{}).videoSource||undefined;
  }, 50);



  return (
    <>
       <div className={(userModel||{}).className||''} ref={contentDiv}>
        
        <div style={{
          // height:'700px',
          float:'left',
          width:'700px'

        }}>

          <div className="content " style={{
            margin:`${divMargin}px`
          }}>
            {/* <img
              src="http://192.168.1.6:8080/videofeed"
              ref={imageRef}
              onLoad={() =>{
                // detectImage(imageRef.current, model, classThreshold, canvasRef.current)

                if(multiModel.length){
                  ((userModel||{}).models||[]).forEach(async (element,index) => {
                    detectImage(((userModel||{}).cameraRef||cameraRef).current,multiModel[index] , element.classThreshold, ((userModel||{}).canvasRef||canvasRef).current,element);
                  });
                }               


                }
              }
            /> */}
            <video
              autoPlay
              muted
              // srcObject ={videoSource}
              ref={cameraRef}
              onPlay={() => {
                if(multiModel.length){
                  ((userModel||{}).models||[]).forEach(async (element,index) => {
                      detectVideo(((userModel||{}).cameraRef||cameraRef).current,multiModel[index] , element.classThreshold, ((userModel||{}).canvasRef||canvasRef).current,element,()=>{
                        if(!userEnabledModels[index].enable){
                          return false;
                        }
                        return true;
                      });
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

        

        <div className="float-right w-[150px] mx-2">
            {modelCheckList}
        </div>

      </div>
    </>
   
    
  );
};

export default ObjectDetecion;
