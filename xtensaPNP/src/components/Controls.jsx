import React from 'react'
import { useRef } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import execuatable from '../utils/operators';
import appLinker, { CONTROLPANEL_FEEDRATE, CONTROLPANEL_SELECTED_TOOL, CONTROLPANEL_UNIT, EXECUATABLE_PROCESS, userStorage } from '../utils/utils';


export const ControlPanel=({machineControl})=>{
  const buttonStyle='bg-teal-900 text-center h-full w-full';
  const toolControlStyle='border border-gray-500 h-full w-full';
  const tootChangeStyle='rounded-md bg-red-600 p-1 m-1';

  const unitRef=useRef();
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
    feedRateRef.current.value=userStorage.get(CONTROLPANEL_FEEDRATE)||userStorage.set(CONTROLPANEL_FEEDRATE,100);
    feedRateSliderRef.current.value=userStorage.get(CONTROLPANEL_FEEDRATE)||userStorage.set(CONTROLPANEL_FEEDRATE,100);
    
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


  return(<>
    <div className='float-right w-[300px]  '>
      <input type="number" className='w-full bg-gray-800 rounded-lg h-[45px] text-blue-300 text-4xl text-center' ref={unitRef} onChange={()=>{
        if(unitRef.current.value<0.1)
          unitRef.current.value=0.1;
        userStorage.set(CONTROLPANEL_UNIT,unitRef.current.value);
      }}/>
      
      <div className='grid grid-cols-5 grid-rows-5 gap-0.5   w-full h-[300px] my-2'>

          {/* <div className='row-start-1 col-start-1 row-end-11 col-end-11'><div className=''></div></div> */}


        <div className='row-start-1 col-start-1 row-span-1 col-span-1'><div className={buttonStyle} onClick={unitUp}>01</div></div>
        <div className='row-start-1 col-start-3 row-span-1 col-span-1'><div className={buttonStyle} onClick={()=>(((machineControl||{}).Y_Positive)||(()=>{}))({unit:unitRef.current.value,feedRate:feedRateRef.current.value})}>02</div></div>
        <div className='row-start-1 col-start-5 row-span-1 col-span-1'><div className={buttonStyle} onClick={()=>(((machineControl||{}).Z_Positive)||(()=>{}))({unit:unitRef.current.value,feedRate:feedRateRef.current.value})}>03</div></div>

        <div className='row-start-3 col-start-1 row-span-1 col-span-1'><div className={buttonStyle} onClick={()=>(((machineControl||{}).X_Negative)||(()=>{}))({unit:unitRef.current.value,feedRate:feedRateRef.current.value})}>04</div></div>
        <div className='row-start-2 col-start-2 row-span-3 col-span-3'><div className={toolControlStyle}>{toolControl}</div></div>
        <div className='row-start-3 col-start-5 row-span-1 col-span-1'><div className={buttonStyle} onClick={()=>(((machineControl||{}).X_Positive)||(()=>{}))({unit:unitRef.current.value,feedRate:feedRateRef.current.value})}>06</div></div>

        <div className='row-start-5 col-start-1 row-span-1 col-span-1'><div className={buttonStyle} onClick={unitDown}>07</div></div>
        <div className='row-start-5 col-start-3 row-span-1 col-span-1'><div className={buttonStyle} onClick={()=>(((machineControl||{}).Y_Negative)||(()=>{}))({unit:unitRef.current.value,feedRate:feedRateRef.current.value})}>08</div></div>
        <div className='row-start-5 col-start-5 row-span-1 col-span-1'><div className={buttonStyle} onClick={()=>(((machineControl||{}).Z_Negative)||(()=>{}))({unit:unitRef.current.value,feedRate:feedRateRef.current.value})}>09</div></div>
        
      </div>
      <div className='w-full'>
        <span className='float-left'>Feed Rate</span>
        <input type="number"  className='float-right  bg-gray-800 rounded-lg text-blue-300 text-center w-1/3' ref={feedRateRef} onChange={()=>{
          if(feedRateRef.current.value<1)
            feedRateRef.current.value=1;
          userStorage.set(CONTROLPANEL_FEEDRATE,feedRateRef.current.value);
          feedRateSliderRef.current.max=feedRateRef.current.value;
          feedRateSliderRef.current.value=feedRateRef.current.value;
        }}/>
      </div>
      <input type="range" className='w-full' ref={feedRateSliderRef} min={1} onChange={()=>{
        userStorage.set(CONTROLPANEL_FEEDRATE,feedRateSliderRef.current.value);
        feedRateRef.current.value=feedRateSliderRef.current.value;

      }}/>
      <div className='w-full my-2 overflow-scroll'>
        <div className='min-w-max'>
          {toolChangeList}
        </div>
      </div>
    </div>

  </>);
};

export const SpindelControl=()=>{
  return(<>
    <span>turn on</span>
    <input type="checkbox" />
    <br />
    <span>RPM</span>
    <br />
    <input type="range" />
  </>);
}

export const SolderPaste=()=>{
  return(<>
    <button>eject</button>
  </>);
}

export const PumpControl=()=>{
  return(<>
    <button>pick</button>
    <br />
    <button>place</button>
    <br />
    
   <span>speed</span>
    <input type="range" />
  </>);
}




export default function Controls() {
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

    setTimeout(() => {
      appLinker.send(EXECUATABLE_PROCESS,{
        operator:execuatable.EXECUATABLE_THREAD,
        execuatableList:[
          {
            operator:execuatable.EXECUATABLE_MOTION_CONTROLLER,
          },
          // {
          //   operator:execuatable.EXECUATABLE_OUTPUT_DEVICE,
          // },
          // {
          //   operator:execuatable.EXECUATABLE_INPUT_DEVICE,
          //   inputDevice:(inputDeviceData=>{
          //     console.log("inputDeviceData >> ",inputDeviceData);
          //   })
          // }
        ]
      })
    }, 2000);

    

  },[]);
  return (
    <>
      <ControlPanel machineControl={{
        Y_Positive:(data)=>{
          console.log("Y_Positive >> ",data);
        },
        Y_Negative:(data)=>{
          console.log("Y_Negative >> ",data);
        },
        X_Positive:(data)=>{
          console.log("X_Positive >> ",data);
        },
        X_Negative:(data)=>{
          console.log("X_Negative >> ",data);
        },
        Z_Positive:(data)=>{
          console.log("Z_Positive >> ",data);
        },
        Z_Negative:(data)=>{
          console.log("Z_Negative >> ",data);
        },
        toolChangeList:[
          {
            label:'spindel',
            activate:()=>{
              console.log("send some commands to enable spindel");
            },
            Control:<SpindelControl/>
          },
          {
            label:'picker',
            activate:()=>{
              console.log("send some commands to enable picker");
            },
            Control:<PumpControl/>
          },
          {
            label:'solder',
            activate:()=>{
              console.log("send some commands to enable SolderPaste");
            },
            Control:<SolderPaste/>
          },
          {

          },
          {

          },
          {

          }
        ]        
      }}/>
    </>
  )
}
