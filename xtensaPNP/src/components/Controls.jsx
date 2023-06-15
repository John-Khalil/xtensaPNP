import React from 'react'
import { useRef } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import execuatable, { pipeline } from '../utils/operators';
import appLinker, { CONTROLPANEL_FEEDRATE, CONTROLPANEL_FEEDRATE_MAX, CONTROLPANEL_SELECTED_TOOL, CONTROLPANEL_UNIT, CONTROLPANEL_UNITZ, ESP3D_ADDRESS, EXECUATABLE_PROCESS, EXECUATABLE_REPORT_ACTION, EXECUATABLE_REPORT_STATUS, MAIN_IP, PUMP_POWER, PUMP_POWER_MAX, SPINDEL_RPM, SPINDEL_RPM_MAX, userStorage } from '../utils/utils';
import AppModal from './AppModal';
import { DynamicConsole } from './ConsoleDynamic';
import ManualJobSetup, { jobSetup } from './ManualJobSetup';
import RunningJobElement from './RunningJobElement';


export const ControlPanel=({machineControl})=>{
  const buttonStyle='bg-teal-900 text-center h-full w-full select-none p-4 font-bold text-lg rounded-md';
  const toolControlStyle='border border-gray-500 h-full w-full';
  const tootChangeStyle='rounded-md bg-red-600 p-1 m-1';

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


        <div className='row-start-1 col-start-1 row-span-1 col-span-1'><div className={buttonStyle} onClick={()=>(((machineControl||{}).unlock)||(()=>{}))()}>01</div></div>
        <div className='row-start-1 col-start-2 row-span-1 col-span-3'><div className={buttonStyle} onClick={()=>(((machineControl||{}).Y_Positive)||(()=>{}))({unit:unitRef.current.value,feedRate:feedRateRef.current.value})}>02</div></div>
        <div className='row-start-1 col-start-5 row-span-1 col-span-1'><div className={buttonStyle} onClick={()=>(((machineControl||{}).Z_Positive)||(()=>{}))({unit:unitZRef.current.value,feedRate:feedRateRef.current.value})}>03</div></div>

        <div className='row-start-2 col-start-1 row-span-3 col-span-1'><div className={buttonStyle} onClick={()=>(((machineControl||{}).X_Negative)||(()=>{}))({unit:unitRef.current.value,feedRate:feedRateRef.current.value})}>04</div></div>
        <div className='row-start-2 col-start-2 row-span-3 col-span-3'><div className={toolControlStyle}>{toolControl}</div></div>
        <div className='row-start-2 col-start-5 row-span-3 col-span-1'><div className={buttonStyle} onClick={()=>(((machineControl||{}).X_Positive)||(()=>{}))({unit:unitRef.current.value,feedRate:feedRateRef.current.value})}>06</div></div>

        <div className='row-start-5 col-start-1 row-span-1 col-span-1'><div className={buttonStyle} onClick={()=>(((machineControl||{}).stop)||(()=>{}))()}>07</div></div>
        <div className='row-start-5 col-start-2 row-span-1 col-span-3'><div className={buttonStyle} onClick={()=>(((machineControl||{}).Y_Negative)||(()=>{}))({unit:unitRef.current.value,feedRate:feedRateRef.current.value})}>08</div></div>
        <div className='row-start-5 col-start-5 row-span-1 col-span-1'><div className={buttonStyle} onClick={()=>(((machineControl||{}).Z_Negative)||(()=>{}))({unit:unitZRef.current.value,feedRate:feedRateRef.current.value})}>09</div></div>
        
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
      .run();
    
    setTimeout(()=>{
      new pipeline()
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
        .clock(1,4300,1)
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

  appLinker.addListener('manga',(data)=>{
    toolChanger.testAutoRun(data)
  })

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
              test
            </div>
            <div className='row-start-1 col-start-2 row-span-1 col-span-1' >
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
                unlock:()=>{
                  console.log("unlock");
                },
                stop:()=>{
                  console.log("stop");
                },
                toolChangeList:[
                  {
                    label:'spindel',
                    activate:()=>{
                      console.log("send some commands to enable spindel");
                      toolChanger.putDown({});


                    },
                    Control:<SpindelControl spindelControl={{
                      on:(data)=>{
                        console.log(" spindel on >> ",data);
                      },
                      off:()=>{
                        console.log(" spindel off ");
                      },
                      setRPM:(data)=>{
                        console.log(" spindel rpm >> ",data);
                      }
                    }}/>
                  },
                  {
                    label:'picker',
                    activate:()=>{
                      console.log("send some commands to enable picker");
                      toolChanger.pickup({});
                    },
                    Control:<PumpControl pumpControl={{
                      on:(data)=>{
                        console.log(" pump on >> ",data);
                      },
                      off:()=>{
                        console.log(" pump off ");
                      },
                      setPower:(data)=>{
                        console.log(" pump power >> ",data);
                      }
                    }}/>
                  },
                  {
                    label:'solder',
                    activate:()=>{
                      console.log("send some commands to enable SolderPaste");
                    },
                    Control:<SolderPaste SolderControl={{
                      eject:()=>{
                        console.log(" eject solder ");
                      }
                    }}/>
                  },
                  {

                  },
                  {

                  },
                  {

                  }
                ]        
              }}/>
              <div className='float-left h-full'>

                <div className='grid grid-cols-1 grid-rows-2 gap-1   w-full h-inherit'>
                  <div className='row-start-2 col-start-1 row-span-1 col-span-1 '>
                    
                  </div>
                  <div className='row-start-1 col-start-1 row-span-1 col-span-1'>
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
                    <button className='bg-blue-600 px-4 rounded-lg text-2xl font-extrabold m-1'>Export</button>
                    <button className='bg-blue-600 px-4 rounded-lg text-2xl font-extrabold m-1'>Load</button>
                  </div>
                </div>
                
              </div>
            </div>
          </div>




          

</div>

</div>
    </>
  )
}
