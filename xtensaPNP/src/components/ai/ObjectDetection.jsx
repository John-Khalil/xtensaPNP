import React, { useState, useEffect, useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl"; // set backend to webgl

import ButtonHandler from "./components/btn-handler";
import { detectImage, detectVideo } from "./utils/detect";


const ObjectDetecion = ({userModel}) => {
  // const [loading, setLoading] = useState({ loading: true, progress: 0 }); // loading state
  // const [model, setModel] = useState({
  //   net: null,
  //   inputShape: [1, 0, 0, 3],
  // }); // init model & input shape

  // references
  const imageRef = useRef(null);
  const cameraRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // model configs
  // const modelName = "yolov5n";
  const classThreshold = (userModel.classThreshold||0.2);
  const videoSource=(userModel||{}).videoSource||undefined;

  // const [multiModel,setMultiModel]=useState([{
  //   net: null,
  //   inputShape: [1, 0, 0, 3],
  // }]);
  const [multiModel,setMultiModel]=useState([]);
1
  useEffect(() => {
    tf.ready().then(async () => {
      // const yolov5 = await tf.loadGraphModel(
      //   `${window.location.origin}/${userModel.modelName}_web_model/model.json`,
      //   {
      //     onProgress: (fractions) => {
      //       // setLoading({ loading: true, progress: fractions }); // set loading fractions


      //     },
      //   }
      // ); // load model

      // // warming up model
      // const dummyInput = tf.ones(yolov5.inputs[0].shape);
      // const warmupResult = await yolov5.executeAsync(dummyInput);
      // tf.dispose(warmupResult); // cleanup memory
      // tf.dispose(dummyInput); // cleanup memory

      // // setLoading({ loading: false, progress: 1 });
      // setModel({
      //   net: yolov5,
      //   inputShape: yolov5.inputs[0].shape,
      // }); // set model & input shape

      const modelArrayBuffer=[];

      ((userModel||{}).models||[]).forEach((element,index) => {
          tf.loadGraphModel(
            `${window.location.origin}/${element.modelName}_web_model/model.json`,
            {
              onProgress: (fractions) => {
    
    
              },
            }
          ).then(async(elementModel)=>{
            // multiModel.push({
              //   net: elementModel,
              //   inputShape: elementModel.inputs[0].shape
              // });
    
              const dummyInput = tf.ones(elementModel.inputs[0].shape);
              const warmupResult = await elementModel.executeAsync(dummyInput);
              tf.dispose(warmupResult);
              tf.dispose(dummyInput);
              modelArrayBuffer.push({ net: elementModel,inputShape: elementModel.inputs[0].shape});
    
              // if((multiModel[0].net==null)){
              //   // console.log('init');
              //   setMultiModel([{ net: elementModel,inputShape: elementModel.inputs[0].shape}]);
              // }
              // else
                // setMultiModel([...multiModel,{ net: elementModel,inputShape: elementModel.inputs[0].shape}]);

                if(index==(userModel.models.length-1))
                  setMultiModel(modelArrayBuffer);
          });
    


      });

    
      // dummyInput = tf.ones(elementModel.inputs[0].shape);
      // warmupResult = await elementModel.executeAsync(dummyInput);
      // tf.dispose(warmupResult);
      // tf.dispose(dummyInput);

      
    });










  }, []);

  // useEffect(()=>{
  //   console.log("multiModel >> ",multiModel);
  // },[multiModel])




  // navigator.mediaDevices.getUserMedia({ video: true })
  // .then((stream) => {
  //   cameraRef.current.srcObject = stream;
  //   // videoRef.current.srcObject = stream;
  // })
  // .catch((error) => {
  //   console.error(error);
  // });

  // setTimeout(() => {
  //   cameraRef.current.srcObject = undefined;
  //   // cameraRef.current.srcObject = videoSource;
  // }, 200000);

  // useEffect(()=>{
  //   cameraRef.current.srcObject = (userModel||{}).videoSource||undefined;
  // },[userModel]);

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
              // detectVideo(((userModel||{}).cameraRef||cameraRef).current, model, classThreshold, ((userModel||{}).canvasRef||canvasRef).current,userModel);
              if(multiModel.length){
                ((userModel||{}).models||[]).forEach(async (element,index) => {
                  // console.log("test >> ",multiModel)
                  // setTimeout(() => {
                    
                  // }, 0);
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

        {/* <ButtonHandler imageRef={imageRef} cameraRef={cameraRef} videoRef={videoRef} /> */}
      </div>
      {otherModels}
    </>
   
    
  );
};

export default ObjectDetecion;
