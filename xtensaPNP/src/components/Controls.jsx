import React from 'react'
import { useRef } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import execuatable, { pipeline } from '../utils/operators';
import appLinker, { CONTROLPANEL_FEEDRATE, CONTROLPANEL_FEEDRATE_MAX, CONTROLPANEL_SELECTED_TOOL, CONTROLPANEL_UNIT, CONTROLPANEL_UNITZ, ESP3D_ADDRESS, EXECUATABLE_PROCESS, EXECUATABLE_REPORT_ACTION, EXECUATABLE_REPORT_STATUS, LIVE_CAMERA_FEED, MAIN_IP, PART_PICKER_END_EFFECTOR, PUMP_POWER, PUMP_POWER_MAX, runOnce, SPINDEL_END_EFFECTOR, SPINDEL_RPM, SPINDEL_RPM_MAX, userStorage } from '../utils/utils';
import AppModal from './AppModal';
import { DynamicConsole } from './ConsoleDynamic';
import ManualJobSetup, { jobSetup } from './ManualJobSetup';
import RunningJobElement from './RunningJobElement';

import camera from '../../public/camera.jpg'


export const ControlPanel=({machineControl})=>{
  const buttonStyle='bg-teal-900 text-center h-full w-full select-none p-4 font-bold text-lg rounded-md';
  const toolControlStyle='border border-gray-500 h-full w-full';
  const tootChangeStyle='rounded-md bg-blue-600 p-1 m-1 px-10 font-bold ';

  const unitRef=useRef();
  const unitZRef=useRef();
  const feedRateRef=useRef();
  const feedRateSliderRef=useRef();

  const [toolChangeList,setToolChangeList]=useState([]);
  const [toolControl,setToolControl]=useState((((machineControl||{}).toolChangeList||[])[userStorage.get(CONTROLPANEL_SELECTED_TOOL)||userStorage.set(CONTROLPANEL_SELECTED_TOOL,0)].Control)||(<>tool control</>));

  useEffect(()=>{
    const toolChangeListBuffer=[];

    ((machineControl||{}).toolChangeList||[]).forEach((tool,index) => {


      toolChangeListBuffer.push(
        <button className={`float-left ${tootChangeStyle}`} onClick={()=>{
          ((tool.activate)||(()=>{}))();
          setToolControl(tool.Control||<>undefined</>);
          userStorage.set(CONTROLPANEL_SELECTED_TOOL,index);
        }}>{tool.label||'tool'}</button>
      );
    });

    setToolChangeList(toolChangeListBuffer);

    unitRef.current.value=userStorage.get(CONTROLPANEL_UNIT)||userStorage.set(CONTROLPANEL_UNIT,1);
    unitZRef.current.value=userStorage.get(CONTROLPANEL_UNITZ)||userStorage.set(CONTROLPANEL_UNITZ,1);
    feedRateRef.current.value=userStorage.get(CONTROLPANEL_FEEDRATE)||userStorage.set(CONTROLPANEL_FEEDRATE,100);
    feedRateSliderRef.current.value=userStorage.get(CONTROLPANEL_FEEDRATE)||userStorage.set(CONTROLPANEL_FEEDRATE,100);
    feedRateSliderRef.current.max=userStorage.get(CONTROLPANEL_FEEDRATE_MAX)||userStorage.set(CONTROLPANEL_FEEDRATE,100);
    
    ((((machineControl||{}).toolChangeList||[])[userStorage.get(CONTROLPANEL_SELECTED_TOOL)||userStorage.set(CONTROLPANEL_SELECTED_TOOL,0)].activate)||(()=>{}))();

  },[]);

  const unitUp=()=>{
    unitRef.current.value*=2;
    if(unitRef.current.value<0.1)
      unitRef.current.value=0.1;
    userStorage.set(CONTROLPANEL_UNIT,unitRef.current.value);
  }

  const unitDown=()=>{
    unitRef.current.value/=2;
    if(unitRef.current.value<0.1)
      unitRef.current.value=0.1;
    userStorage.set(CONTROLPANEL_UNIT,unitRef.current.value);
  }

  const unitUpZ=()=>{
    unitZRef.current.value*=2;
    if(unitZRef.current.value<0.1)
      unitZRef.current.value=0.1;
    userStorage.set(CONTROLPANEL_UNITZ,unitZRef.current.value);
  }

  const unitDownZ=()=>{
    unitZRef.current.value/=2;
    if(unitZRef.current.value<0.1)
      unitZRef.current.value=0.1;
    userStorage.set(CONTROLPANEL_UNITZ,unitZRef.current.value);
  }


  return(<>
    <div className='float-right w-[300px]  '>

      <div className='w-full my-2 overflow-scroll'>
        <div className='min-w-max'>
          {toolChangeList}
        </div>
      </div>

      
      
      
      <div className='grid grid-cols-5 grid-rows-5 gap-1   w-full h-[300px] my-2'>

          {/* <div className='row-start-1 col-start-1 row-end-11 col-end-11'><div className=''></div></div> */}


        <div className='row-start-1 col-start-1 row-span-1 col-span-1'><div className={buttonStyle} onClick={()=>(((machineControl||{}).unlock)||(()=>{}))()}>$X</div></div>
        <div className='row-start-1 col-start-2 row-span-1 col-span-3'><div className={buttonStyle} onClick={()=>(((machineControl||{}).Y_Positive)||(()=>{}))({unit:unitRef.current.value,feedRate:feedRateRef.current.value})}>Y+</div></div>
        <div className='row-start-1 col-start-5 row-span-1 col-span-1'><div className={buttonStyle} onClick={()=>(((machineControl||{}).Z_Positive)||(()=>{}))({unit:unitZRef.current.value,feedRate:feedRateRef.current.value})}>Z+</div></div>

        <div className='row-start-2 col-start-1 row-span-3 col-span-1'><div className={buttonStyle} onClick={()=>(((machineControl||{}).X_Negative)||(()=>{}))({unit:unitRef.current.value,feedRate:feedRateRef.current.value})}><div className='mt-16'>X-</div></div></div>
        <div className='row-start-2 col-start-2 row-span-3 col-span-3'><div className={toolControlStyle}>{toolControl}</div></div>
        <div className='row-start-2 col-start-5 row-span-3 col-span-1'><div className={buttonStyle} onClick={()=>(((machineControl||{}).X_Positive)||(()=>{}))({unit:unitRef.current.value,feedRate:feedRateRef.current.value})}><div className='mt-16'>X+</div></div></div>

        <div className='row-start-5 col-start-1 row-span-1 col-span-1'><div className={buttonStyle} onClick={()=>(((machineControl||{}).stop)||(()=>{}))()}>$H</div></div>
        <div className='row-start-5 col-start-2 row-span-1 col-span-3'><div className={buttonStyle} onClick={()=>(((machineControl||{}).Y_Negative)||(()=>{}))({unit:unitRef.current.value,feedRate:feedRateRef.current.value})}>Y-</div></div>
        <div className='row-start-5 col-start-5 row-span-1 col-span-1'><div className={buttonStyle} onClick={()=>(((machineControl||{}).Z_Negative)||(()=>{}))({unit:unitZRef.current.value,feedRate:feedRateRef.current.value})}>Z-</div></div>
        
      </div>
      <div className='w-full'>
        <span className='float-left'>Feed Rate</span>
        <input type="number"  className='float-right  bg-gray-800 rounded-lg text-blue-300 text-center w-1/3' ref={feedRateRef} onChange={()=>{
          if(feedRateRef.current.value<1)
            feedRateRef.current.value=1;
          userStorage.set(CONTROLPANEL_FEEDRATE,feedRateRef.current.value);
          userStorage.set(CONTROLPANEL_FEEDRATE_MAX,feedRateRef.current.value);
          feedRateSliderRef.current.max=feedRateRef.current.value;
          feedRateSliderRef.current.value=feedRateRef.current.value;
        }}/>
      </div>
      <input type="range" className='w-full' ref={feedRateSliderRef} min={1} onChange={()=>{
        userStorage.set(CONTROLPANEL_FEEDRATE,feedRateSliderRef.current.value);
        feedRateRef.current.value=feedRateSliderRef.current.value;

      }}/>
      
      <span className='float-left'>UNIT-XY</span>
      <div className='grid grid-cols-5 grid-rows-1 gap-1   w-full h-[60px] my-2'>
        <div className='row-start-1 col-start-1 row-span-1 col-span-1'><div className={buttonStyle} onClick={unitDown}>-</div></div>
        <div className='row-start-1 col-start-2 row-span-1 col-span-3'>
          <input type="number" className='w-full bg-gray-800 rounded-lg h-full text-blue-300 text-4xl text-center' ref={unitRef} onChange={()=>{
            if(unitRef.current.value<0.1)
              unitRef.current.value=0.1;
            userStorage.set(CONTROLPANEL_UNIT,unitRef.current.value);
          }}/>
        </div>
        <div className='row-start-1 col-start-5 row-span-1 col-span-1'><div className={buttonStyle} onClick={unitUp}>+</div></div>
      </div>
      <span className='float-left'>UNIT-Z</span>
      <div className='grid grid-cols-5 grid-rows-1 gap-1   w-full h-[60px] my-2'>
        <div className='row-start-1 col-start-1 row-span-1 col-span-1'><div className={buttonStyle} onClick={unitDownZ}>-</div></div>
        <div className='row-start-1 col-start-2 row-span-1 col-span-3'>
          <input type="number" className='w-full bg-gray-800 rounded-lg h-full text-blue-300 text-4xl text-center' ref={unitZRef} onChange={()=>{
            if(unitZRef.current.value<0.1)
              unitZRef.current.value=0.1;
            userStorage.set(CONTROLPANEL_UNITZ,unitZRef.current.value);
          }}/>
        </div>
        <div className='row-start-1 col-start-5 row-span-1 col-span-1'><div className={buttonStyle} onClick={unitUpZ}>+</div></div>
      </div>


    </div>

  </>);
};

export const SpindelControl=({spindelControl})=>{
  const rpmRef=useRef();
  const rpmSliderRef=useRef();

  const buttonStyle='text-center h-full w-full select-none p-2 font-bold text-lg rounded-md';
  useEffect(()=>{
    rpmRef.current.value=userStorage.get(SPINDEL_RPM)||userStorage.set(SPINDEL_RPM,100);
    rpmSliderRef.current.value=userStorage.get(SPINDEL_RPM)||userStorage.set(SPINDEL_RPM,100);
    rpmSliderRef.current.max=userStorage.get(SPINDEL_RPM_MAX)||userStorage.set(SPINDEL_RPM_MAX,100);
  },[]);
  return(<>

    <div className='w-full text-2xl text-center my-1'>SPINDEL</div>

    <div className='grid grid-cols-2 grid-rows-1 gap-1   w-full h-[60px] my-2 p-2'>
      <div className='row-start-1 col-start-1 row-span-1 col-span-1'><div className={`${buttonStyle} bg-green-500`} onClick={()=>{((spindelControl||{}).on||(()=>{}))({rpm:rpmRef.current.value})}}>ON</div></div>
      <div className='row-start-1 col-start-2 row-span-1 col-span-1'><div className={`${buttonStyle} bg-red-500`} onClick={()=>{((spindelControl||{}).off||(()=>{}))()}}>OFF</div></div>
    </div>


    <div className='p-2'>

   

      <div className='w-full'>
        <span className='float-left'>RPM</span>
        <input type="number"  className='float-right  bg-gray-800 rounded-lg text-blue-300 text-center w-1/3' ref={rpmRef} onChange={()=>{
          if(rpmRef.current.value<1)
            rpmRef.current.value=1;
          userStorage.set(SPINDEL_RPM,rpmRef.current.value);
          userStorage.set(SPINDEL_RPM_MAX,rpmRef.current.value);
          rpmSliderRef.current.max=rpmRef.current.value;
          rpmSliderRef.current.value=rpmRef.current.value;

          ((spindelControl||{}).setRPM||(()=>{}))({rpm:rpmRef.current.value});

        }}/>
      </div>
      <input type="range" className='w-full' ref={rpmSliderRef} min={1} onChange={()=>{
        userStorage.set(SPINDEL_RPM,rpmSliderRef.current.value);
        rpmRef.current.value=rpmSliderRef.current.value;
        
        ((spindelControl||{}).setRPM||(()=>{}))({rpm:rpmRef.current.value});

      }}/>

    </div>



  </>);
}

export const SolderPaste=({SolderControl})=>{
  return(<>
    <div className='p-1'>

      <div className='w-full text-2xl text-center my-1'>SOLDER</div>
      <div className='w-full text-2xl text-center my-1 bg-green-500 rounded-md'><button onClick={()=>{((SolderControl||{}).eject||(()=>{}))()}}>EJECT</button></div>
    </div>
      
  </>);
}

export const PumpControl=({pumpControl})=>{
  const rpmRef=useRef();
  const rpmSliderRef=useRef();

  const buttonStyle='text-center h-full w-full select-none p-2 font-bold text-lg rounded-md';
  useEffect(()=>{
    rpmRef.current.value=userStorage.get(PUMP_POWER)||userStorage.set(PUMP_POWER,100);
    rpmSliderRef.current.value=userStorage.get(PUMP_POWER)||userStorage.set(PUMP_POWER,100);
    rpmSliderRef.current.max=userStorage.get(PUMP_POWER_MAX)||userStorage.set(PUMP_POWER_MAX,100);
  },[]);
  return(<>

    <div className='w-full text-2xl text-center my-1'>PUMP</div>

    <div className='grid grid-cols-2 grid-rows-1 gap-1   w-full h-[60px] my-2 p-2'>
      <div className='row-start-1 col-start-1 row-span-1 col-span-1'><div className={`${buttonStyle} bg-green-500`} onClick={()=>{((pumpControl||{}).on||(()=>{}))({power:rpmRef.current.value})}}>ON</div></div>
      <div className='row-start-1 col-start-2 row-span-1 col-span-1'><div className={`${buttonStyle} bg-red-500`} onClick={()=>{((pumpControl||{}).off||(()=>{}))()}}>OFF</div></div>
    </div>


    <div className='p-2'>

   

      <div className='w-full'>
        <span className='float-left'>POWER</span>
        <input type="number"  className='float-right  bg-gray-800 rounded-lg text-blue-300 text-center w-1/3' ref={rpmRef} onChange={()=>{
          if(rpmRef.current.value<1)
            rpmRef.current.value=1;
          userStorage.set(PUMP_POWER,rpmRef.current.value);
          userStorage.set(PUMP_POWER_MAX,rpmRef.current.value);
          rpmSliderRef.current.max=rpmRef.current.value;
          rpmSliderRef.current.value=rpmRef.current.value;

          ((pumpControl||{}).setPower||(()=>{}))({power:rpmRef.current.value});

        }}/>
      </div>
      <input type="range" className='w-full' ref={rpmSliderRef} min={1} onChange={()=>{
        userStorage.set(PUMP_POWER,rpmSliderRef.current.value);
        rpmRef.current.value=rpmSliderRef.current.value;
        
        ((pumpControl||{}).setPower||(()=>{}))({power:rpmRef.current.value});

      }}/>

    </div>



  </>);
}


// export const pickup=({x=335,y=300,zPickup=0,zPutDown=33,zClamp=28,delayTime=30000,feedRate=2500})=>{
//   new pipeline()
//     .gcode(`G1 X0 F${feedRate}`)
//     .gcode(`G1 Y0 F${feedRate}`)
//     .gcode(`G1 Z${zClamp} F${feedRate}`)
//     .gcode(`G1 Y${y} F${feedRate}`)
//     .gcode(`G1 X${x} F${feedRate}`)
//     .run();
  
//   setTimeout(()=>{
//     new pipeline()
//       .outputPort1(1,0)
//       .clock(0,4500,1)
//       .outputPort1(0,0)
//       .gcode(`G1 Z${zPickup} F${feedRate}`)
//       .gcode(`G1 X0 F${feedRate}`)
//       .gcode(`G1 Y0 F${feedRate}`)
//       .run();
//   },delayTime);
  
//   return;
// }

// export const putDown=({x=335,y=300,zPickup=0,zPutDown=33,zClamp=28,delayTime=30000,feedRate=2500})=>{
//   new pipeline()
//     .gcode(`G1 X0 F${feedRate}`)
//     .gcode(`G1 Y0 F${feedRate}`)
//     .gcode(`G1 Z${zPickup} F${feedRate}`)
//     .gcode(`G1 Y${y} F${feedRate}`)
//     .gcode(`G1 X${x} F${feedRate}`)
//     .gcode(`G1 Z${zPutDown} F${feedRate}`)
//     .run();
  
//   setTimeout(()=>{
//     new pipeline()
//       .outputPort1(0,0)
//       .clock(1,3800,1)
//       .outputPort1(1,0)
//       .gcode(`G1 Z${zClamp} F${feedRate}`)
//       .gcode(`G1 X0 F${feedRate}`)
//       .gcode(`G1 Y0 F${feedRate}`)
//       .run();
//   },delayTime);
  
//   return;
// }

export const toolChanger={
  putDownCounter:-1,
  pickupCounter:-1,


  pickup:({x=335,y=298,zPickup=0,zPutDown=33,zClamp=28,delayTime=30000,feedRate=2500})=>{
    toolChanger.pickupCounter++;
    if(toolChanger.pickupCounter==0)
      return;

    const clampON=new runOnce();
    
    new pipeline()
      // .outputPort1(15,1)
      // .gcode(`$X`)
      // .gcode(`$X`)
      // .gcode(`$H`)
      .gcode(`G1 X0 F${feedRate}`)
      .gcode(`G1 Y0 F${feedRate}`)
      .gcode(`G1 Z${zClamp} F${feedRate}`)
      .gcode(`G1 Y${y} F${feedRate}`)
      .gcode(`G1 X${x} F${feedRate}`)
      // .gcode(`?`).gcode(`?`).gcode(`?`).gcode(`?`).gcode(`?`).gcode(`?`).gcode(`?`).gcode(`?`).gcode(`?`).gcode(`?`).gcode(`?`).gcode(`?`).gcode(`?`)
      .run();

      // appLinker.addListener(EXECUATABLE_REPORT_STATUS,statusObject=>{
      //   if(statusObject.ack==execuatable.MOTIONCONTROLLER_ACK){
      //     // const x_coordinate=parseInt(((statusObject||{}).returnData).split(':')[1].split(',')[0])==parseInt(x);
      //     // const y_coordinate=parseInt(((statusObject||{}).returnData).split(':')[1].split(',')[1])==parseInt(y);
      //     // const z_coordinate=parseInt(((statusObject||{}).returnData).split(':')[1].split(',')[2])==parseInt(zClamp);
      //     if((parseInt(((statusObject||{}).returnData).split(':')[1].split(',')[0])==parseInt(x))&&(parseInt(((statusObject||{}).returnData).split(':')[1].split(',')[1])==parseInt(y))&&(parseInt(((statusObject||{}).returnData).split(':')[1].split(',')[2])==parseInt(zClamp))){
      //       clampON.run(()=>{
      //         new pipeline()
      //           .outputPort1(1,0)
      //           .clock(0,4500,1)
      //           .outputPort1(0,0)
      //           .gcode(`G1 Z${zPickup} F${feedRate}`)
      //           .gcode(`G1 X0 F${feedRate}`)
      //           .gcode(`G1 Y0 F${feedRate}`)
      //           .run();
      //       })
      //     }

          
          
      //   }
      // });
      
    setTimeout(()=>{
      new pipeline()
        .gcode(`G1 Z${zPutDown} F${feedRate}`)
        .outputPort1(1,0)
        .clock(0,4500,1)
        .outputPort1(0,0)
        .gcode(`G1 Z${zPickup} F${feedRate}`)
        .gcode(`G1 X0 F${feedRate}`)
        .gcode(`G1 Y0 F${feedRate}`)
        .run();
    },delayTime);
    
    return;
  },

  putDown:({x=335,y=298,zPickup=0,zPutDown=33,zClamp=28,delayTime=30000,feedRate=2500})=>{
    toolChanger.putDownCounter++;
    if(toolChanger.putDownCounter==0)
      return;
    new pipeline()
      // .outputPort1(15,1)
      // .gcode(`$X`)
      // .gcode(`$X`)
      // .gcode(`$H`)
      .gcode(`G1 X0 F${feedRate}`)
      .gcode(`G1 Y0 F${feedRate}`)
      .gcode(`G1 Z${zPickup} F${feedRate}`)
      .gcode(`G1 Y${y} F${feedRate}`)
      .gcode(`G1 X${x} F${feedRate}`)
      .gcode(`G1 Z${zPutDown} F${feedRate}`)
      .run();
    
    setTimeout(()=>{
      new pipeline()
        .outputPort1(0,0)
        .clock(1,3800,1)
        .outputPort1(1,0)
        .gcode(`G1 Z${zClamp} F${feedRate}`)
        .gcode(`G1 X0 F${feedRate}`)
        .gcode(`G1 Y0 F${feedRate}`)
        .run();
    },delayTime);
    
    return;
  }




}





export default function Controls() {

  const [runningJob,showRunningJob]=useState(<></>);

  const [gcode,showGCODE]=useState('');

  const [videoSource,setVideoSource]=useState(undefined);

  const camPlaceholderRef=useRef();

  const camStream=useRef();



  appLinker.addListener(EXECUATABLE_REPORT_ACTION,data=>{
      
  });

  appLinker.addListener(EXECUATABLE_REPORT_STATUS,statusObject=>{
    showRunningJob(<RunningJobElement statusObject={statusObject}/>)
  });

  appLinker.addListener(EXECUATABLE_REPORT_STATUS,statusObject=>{
      console.log(statusObject.ack==execuatable.MOTIONCONTROLLER_ACK)
      if(statusObject.ack==execuatable.MOTIONCONTROLLER_ACK){
        showGCODE(
          <>
            <div className='text-red-400'>{(((statusObject||{}).gcode)||'')}</div>
            <div className='text-amber-200'>{(((statusObject||{}).returnData)||'')}</div>
          </>
        );
      }
  });

  const gcodeSend=command=>{
    appLinker.send(EXECUATABLE_PROCESS,{
      operator:execuatable.EXECUATABLE_MOTION_CONTROLLER,
      gcode:command.consoleData
    })
  }

  useEffect(()=>{
    // execuatable.send=data=>console.log(data)
    // new execuatable({operator:"thread",execuatableList:[
    //   {
    //     operator:'motionController',
    //     gcode:["$X","X0"]
    //   },
    //   {
    //     operator:'inputDevice',
    //     ipAddress:'xtensa32plus.ddns.net',
    //     port:19350
    //   }
    // ]})

    // setTimeout(() => {
    //   appLinker.send(EXECUATABLE_PROCESS,{
    //     operator:execuatable.EXECUATABLE_THREAD,
    //     execuatableList:[
    //       {
    //         operator:execuatable.EXECUATABLE_MOTION_CONTROLLER,
    //       },
    //       {
    //         operator:execuatable.EXECUATABLE_OUTPUT_DEVICE,
    //       },
    //       {
    //         operator:execuatable.EXECUATABLE_INPUT_DEVICE,
    //         customKey:'this is a text',
    //         inputDevice:(inputDeviceData=>{
    //           console.log("inputDeviceData >> ",inputDeviceData);
    //         })
    //       }
    //     ]
    //   })
    // }, 2000);
    // navigator.mediaDevices.getUserMedia({ video: true })
    // .then((stream) => {
    //   setVideoSource(stream);
    //   // videoRef.current.srcObject = stream;
    // })
    // .catch((error) => {
    //   console.error(error);
    // });
    setTimeout(() => {
      new pipeline().gcode('?').run();

      // setInterval(() => {
      //   new pipeline().gcode('?').run();
      // }, 5000);
      
      setTimeout(() => {
        new pipeline().outputPort1(15,0).run();
      }, 500);


    }, 500);


  },[]);
  return (
    <>

      <AppModal identifier={'jobSetup'}/>

      <div className='grid grid-cols-1 grid-rows-2 gap-1   w-full '>
        <div className='row-start-2 col-start-1 row-span-1 col-span-1 h-[400px]'>

          <div className='grid grid-cols-2 grid-rows- gap-1   w-full '>
            <div className='row-start-1 col-start-1 row-span-1 col-span-1'>
              <DynamicConsole userConsole={{
                className:'lg:w-[calc(100% -16)] ',
                consoleInput:true,
                // clearConsole:true,
                // themeColor:'#a11caf',
                themeColor:'darkslategray',
                height:190,
                consoleData:gcode,
                send:gcodeSend,
                hide:false,
                consoleIdentifier:'G-CODE',
                // textColor:'#00ff00',
                // themeColor:'rgb(0,0,0)'
                
                
              }}/>
            </div>
            <div className='row-start-1 col-start-2 row-span-1 col-span-1'>
              <DynamicConsole userConsole={{
                className:'lg:w-[calc(100% -16)] ',
                // consoleInput:true,
                // clearConsole:true,
                themeColor:'dimgray',
                height:254,
                consoleData:runningJob,
                // send:getConsoleInput,
                hide:false,
                consoleIdentifier:'RUNNING JOB',
                textColor:'#00ff00',
                // themeColor:'rgb(0,0,0)'
                
                
              }}/>
            </div>
          </div>
        </div>
        <div className='row-start-1 col-start-1 row-span-1 col-span-1'>
        
          <div className='grid grid-cols-2 grid-rows-1 gap-1   w-full '>
            <div className='row-start-1 col-start-1 row-span-1 col-span-1' >
              {/* <video 
  
                autoPlay
                muted
                src ={videoSource}
              // ></video> */}
              <img src={userStorage.get(LIVE_CAMERA_FEED)||userStorage.set(LIVE_CAMERA_FEED,'http://192.168.1.6:8080/videofeed')} alt="" className='rounded-lg m-1' ref={camStream} onLoad={()=>{
                //h-[587px] w-[783 px]
                camPlaceholderRef.current.style.display='none';
                camStream.current.style.height=587;
                camStream.current.style.width=783;
              }}/>

              <img src={camera} alt="Camera Feed" className='rounded-lg m-1 ' ref={camPlaceholderRef}/>

              {/* <div className='rounded-lg bg-sky-500'>
              </div> */}
            </div>
            <div className='row-start-1 col-start-2 row-span-1 col-span-1 ml-2' >
              <ControlPanel machineControl={{
                Y_Positive:(data)=>{
                  // console.log("Y_Positive >> ",data);
                  new pipeline().gcode(`G91 G21 Y${data.unit} F${data.feedRate}`).gcode('G90').run();
                },
                Y_Negative:(data)=>{
                  // console.log("Y_Negative >> ",data);
                  new pipeline().gcode(`G91 G21 Y-${data.unit} F${data.feedRate}`).gcode('G90').run();
                },
                X_Positive:(data)=>{
                  // console.log("X_Positive >> ",data);
                  new pipeline().gcode(`G91 G21 X${data.unit} F${data.feedRate}`).gcode('G90').run();
                },
                X_Negative:(data)=>{
                  // console.log("X_Negative >> ",data);
                  new pipeline().gcode(`G91 G21 X-${data.unit} F${data.feedRate}`).gcode('G90').run();
                },
                Z_Positive:(data)=>{
                  // console.log("Z_Positive >> ",data);
                  new pipeline().gcode(`G91 G21 Z${data.unit} F${data.feedRate}`).gcode('G90').run();
                },
                Z_Negative:(data)=>{
                  // console.log("Z_Negative >> ",data);
                  new pipeline().gcode(`G91 G21 Z-${data.unit} F${data.feedRate}`).gcode('G90').run();
                },
                unlock:()=>{
                  // console.log("unlock");
                  new pipeline().gcode('$X').gcode('G90').run();
                },
                stop:()=>{
                  // console.log("stop");
                  new pipeline().gcode('$H').gcode('G90').run();
                },
                toolChangeList:[
                  {
                    label:'SPINDEL',
                    activate:()=>{
                      // console.log("send some commands to enable spindel");
                      new pipeline().outputPort1(2,1).run();
                      // toolChanger.putDown({});


                    },
                    Control:<SpindelControl spindelControl={{
                      on:(data)=>{
                        // console.log(" spindel on >> ",data);
                        new pipeline().gcode(`S${data.rpm}`).gcode('M3').run();
                      },
                      off:()=>{
                        // console.log(" spindel off ");
                        new pipeline().gcode('M5').run();
                      },
                      setRPM:(data)=>{
                        // console.log(" spindel rpm >> ",data);
                        new pipeline().gcode(`S${data.rpm}`).run();
                      }
                    }}/>
                  },
                  {
                    label:'PICKER',
                    activate:()=>{
                      // console.log("send some commands to enable picker");
                      new pipeline().outputPort1(2,0).run();
                      // toolChanger.pickup({});
                    },
                    Control:<PumpControl pumpControl={{
                      on:(data)=>{
                        // console.log(" pump on >> ",data);
                        new pipeline().gcode(`S${data.power}`).gcode('M3').run();
                      },
                      off:()=>{
                        // console.log(" pump off ");
                        new pipeline().gcode('M5').run();
                      },
                      setPower:(data)=>{
                        // console.log(" pump power >> ",data);
                        new pipeline().gcode(`S${data.power}`).run();
                      }
                    }}/>
                  },
                  // {
                  //   label:'solder',
                  //   activate:()=>{
                  //     console.log("send some commands to enable SolderPaste");
                  //   },
                  //   Control:<SolderPaste SolderControl={{
                  //     eject:()=>{
                  //       console.log(" eject solder ");
                  //     }
                  //   }}/>
                  // },

                ]        
              }}/>
              <div className='float-left h-full'>

                <span className='text-2xl font-extrabold'>Job Setup</span>
                <br />
                <button className='bg-blue-600 px-4 rounded-lg text-2xl font-extrabold m-1' onClick={()=>{
                  appLinker.send('jobSetup@AppModal-setContent',<>
                    <ManualJobSetup/>

                  </>);
                  appLinker.send('jobSetup@AppModal-setOpen',true);
                }}>Setup</button>
                <button className='bg-green-500 px-4 rounded-lg text-2xl font-extrabold m-1' onClick={()=>{
                  jobSetup().run();
                }}>Run</button>
                <br />
                <span className='text-2xl font-extrabold'>Extras</span>
                <br />
                <button className='bg-blue-600 px-4 rounded-lg text-2xl font-extrabold m-1' onClick={()=>{
                  appLinker.send('jobSetup@AppModal-setContent',<>
                    <iframe src={`http://${userStorage.get(ESP3D_ADDRESS)||userStorage.set(ESP3D_ADDRESS,MAIN_IP)}`} className='w-full h-[90%]'></iframe>
                  </>);
                  appLinker.send('jobSetup@AppModal-setOpen',true);
                }}>ESP3D APP</button>
                <button className='bg-blue-600 px-4 rounded-lg text-2xl font-extrabold m-2'>Export</button>
                <button className='bg-blue-600 px-4 rounded-lg text-2xl font-extrabold m-1'>Load</button>
                <br />
                <span className='text-2xl font-extrabold'>Part Picker</span>
                <br />
                <button className='bg-red-500 px-4 rounded-lg text-2xl font-extrabold m-1' onClick={()=>{
                  // toolChanger.putDown({x:335,y:297});
                  toolChanger.putDown(userStorage.get(PART_PICKER_END_EFFECTOR)||userStorage.set(PART_PICKER_END_EFFECTOR,{x:335,y:297,zPickup:0,zPutDown:33,zClamp:28,delayTime:30000,feedRate:2500}));
                }}>Detach</button>
                <button className='bg-green-500 px-4 rounded-lg text-2xl font-extrabold m-1' onClick={()=>{
                  new pipeline().outputPort1(2,1).run();
                  setTimeout(() => {
                    // toolChanger.pickup({x:335,y:297});
                    toolChanger.pickup(userStorage.get(PART_PICKER_END_EFFECTOR)||userStorage.set(PART_PICKER_END_EFFECTOR,{x:335,y:297,zPickup:0,zPutDown:33,zClamp:28,delayTime:30000,feedRate:2500}));
                  }, 500);
                }}>Attach</button>
                
                <br />
                <span className='text-2xl font-extrabold'>Spindel</span>
                <br />
                <button className='bg-red-500 px-4 rounded-lg text-2xl font-extrabold m-1' onClick={()=>{
                  // toolChanger.putDown({x:335,y:47,delayTime:20000});
                  toolChanger.putDown(userStorage.get(SPINDEL_END_EFFECTOR)||userStorage.set(SPINDEL_END_EFFECTOR,{x:335,y:47,zPickup:0,zPutDown:33,zClamp:28,delayTime:20000,feedRate:2500}));
                }}>Detach</button>
                <button className='bg-green-500 px-4 rounded-lg text-2xl font-extrabold m-1' onClick={()=>{
                  new pipeline().outputPort1(2,1).run();
                  setTimeout(() => {
                    // toolChanger.pickup({x:335,y:47,delayTime:20000});
                    toolChanger.pickup(userStorage.get(SPINDEL_END_EFFECTOR)||userStorage.set(SPINDEL_END_EFFECTOR,{x:335,y:47,zPickup:0,zPutDown:33,zClamp:28,delayTime:20000,feedRate:2500}));
                  }, 500);
                }}>Attach</button>

                <br />
                <span className='text-2xl font-extrabold'>C-Clamp</span>
                <br />
                <button className='bg-red-500 px-9 rounded-lg text-2xl font-extrabold m-1' onClick={()=>{
                  new pipeline()
                  .outputPort1(0,0)
                  .clock(1,2000,1)
                  .outputPort1(1,0)
                  .run();
                }}>OFF</button>
                <button className='bg-green-500 px-9 rounded-lg text-2xl font-extrabold m-1' onClick={()=>{
                  new pipeline()
                  .outputPort1(1,0)
                  .clock(0,2000,1)
                  .outputPort1(0,0)
                  .run();
                }}>ON</button>

              </div>
            </div>
          </div>




          

</div>

</div>
    </>
  )
}
