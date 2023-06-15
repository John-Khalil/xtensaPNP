import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useRef } from 'react';
import { pipeline } from '../utils/operators';
import appLinker, { PARTS_LIST, userStorage } from '../utils/utils';

export const AddComponent=({component})=>{
  const formInputString='w-full bg-gray-700 rounded-lg text-blue-300 text-xl text-center float-right';
    const pcb_x=useRef();
    const pcb_y=useRef();
    const pcb_z=useRef();
    const partLabel=useRef();
    const partWidth=useRef();
    const partHeight=useRef();
    const partLength=useRef();
    const partOrientation=useRef();
    const partTray=useRef();
    
    return (
        <>
          <span className='text-2xl font-black'>Component</span>
          <div className='grid grid-cols-5 grid-rows-1 gap-1   w-[60%] my-2'>
            <div className='row-start-1 col-start-1 row-span-1 col-span-1'>
              <span>Length</span>
              <input className={formInputString} type="number" ref={partLength}/>
            </div>
            <div className='row-start-1 col-start-2 row-span-1 col-span-1'>
              <span>Width</span>
              <input className={formInputString} type="number" ref={partWidth}/>
            </div>
            <div className='row-start-1 col-start-3 row-span-1 col-span-1'>
              <span>Height</span>
              <input className={formInputString} type="number" ref={partHeight}/>
            </div>
            <div className='row-start-1 col-start-4 row-span-1 col-span-1'>
              <span>Orientation</span>
              <input className={formInputString} type="number" ref={partOrientation}/>
            </div>
            <div className='row-start-1 col-start-5 row-span-1 col-span-1'>
              <span>Tray</span>
              <input className={formInputString} type="number" ref={partTray}/>
            </div>
          </div>

          <span className='text-2xl font-black'>PCB</span>
            <div className='grid grid-cols-5 grid-rows-1 gap-1   w-[60%]  my-2'>
              <div className='row-start-1 col-start-1 row-span-1 col-span-1'>
                <span>X-Coordinate</span>
                <input className={formInputString} type="number" ref={pcb_x}/>
              </div>
              <div className='row-start-1 col-start-2 row-span-1 col-span-1'>
                <span>Y-Coordinate</span>
                <input className={formInputString} type="number" ref={pcb_y}/>
              </div>
              <div className='row-start-1 col-start-3 row-span-1 col-span-1'>
                <span>Z-Coordinate</span>
                <input className={formInputString} type="number" ref={pcb_z}/>
              </div>
              <div className='row-start-1 col-start-4 row-span-1 col-span-1'>
                <span>Label</span>
                <input className={formInputString} type="text" ref={partLabel}/>
              </div>
              <div className='row-start-1 col-start-5 row-span-1 col-span-1'>
                <span><pre> </pre></span>
                <button className='bg-green-600 text-xl text-center w-full rounded-lg' onClick={()=>{
                  ((component||{}).submit||(()=>{}))({
                    pcb_x:pcb_x.current.value||20,
                    pcb_y:pcb_y.current.value||20,
                    pcb_z:pcb_z.current.value||2,
                    partLabel:partLabel.current.value,
                    partWidth:partWidth.current.value||1,
                    partHeight:partHeight.current.value||1,
                    partLength:partLength.current.value||2,
                    partOrientation:partOrientation.current.value||0,
                    partTray:partTray.current.value||0,
                  });
                }}>Add</button>
              </div>
            </div>

            
        </>
    )
}

export const jobSetup=()=>{
  const x0=7;
  const y0=17;

  const pcb_x0=39;
  const pcb_y0=39;

  const feedRate=3000;
  const pumpSpeed=500;
  const jobSetupPipeline=new pipeline().gcode(`$H`).gcode(`S${pumpSpeed}`);
  (userStorage.get(PARTS_LIST)||userStorage.set(PARTS_LIST,[])).forEach(element => {
    jobSetupPipeline
    .gcode(`G1 X${x0+(15*Math.floor((parseInt(element.partTray)-((parseInt(element.partTray)<14)?0:10))/((parseInt(element.partTray)<14)?7:2)))+(parseFloat(element.partWidth)/2)} Y${y0+(15*(parseInt(element.partTray)%((parseInt(element.partTray)<14)?7:2)))-(parseFloat(element.partLength)/2)} F${feedRate}`)
    // .gcode(`G1 X${x0+(15*Math.floor((element.partTray-((element.partTray<14)?0:10))/((element.partTray<14)?7:2)))} Y${y0+(15*(element.partTray%((element.partTray<14)?7:2)))} F${feedRate}`)
    .gcode(`G1 Z${33-1-parseFloat(element.partHeight)} F${feedRate}`)
    .gcode(`M3`)
    .gcode(`G1 Z0 F${feedRate}`)
    .gcode(`G1 X${pcb_x0+parseFloat(element.pcb_x)} Y${pcb_y0+parseFloat(element.pcb_y)} F${feedRate}`)
    .gcode(`G1 C${element.partOrientation} F${feedRate}`)
    .gcode(`G1 Z${33-parseFloat(element.pcb_z)} F${feedRate}`)
    .gcode(`M5`)
    .gcode(`G1 Z0 F${feedRate}`)
    .gcode(`G1 C0 F${feedRate}`)

  });
  return jobSetupPipeline.gcode(`$H`);
}

export default function ManualJobSetup() {
  let partsListBufer=userStorage.get(PARTS_LIST)||userStorage.set(PARTS_LIST,[]);
  const [partsList,setPartsList]=useState([]);

  const updatePartsList=()=>{
    let renderBuffer=[];
    partsListBufer.forEach((element,index) => {
      renderBuffer.push(<>
        <div className='bg-gray-900 rounded-md w-full text-left p-4 my-1'>
          <span>{element.partLabel||'label'}</span>
          <div className='float-right'>
            <div className='grid grid-cols-3 grid-rows-1 gap-1  w-fit '>

              <div className='row-start-1 col-start-1 row-span-1  col-span-1'>
                <button className='bg-gray-500 text-right h-full  select-none px-2 font-bold text-lg rounded-md' onClick={()=>{
                  let switchBuffer=partsListBufer[index+1];
                  if(switchBuffer==undefined)
                    return;
                  partsListBufer[index+1]=partsListBufer[index];
                  partsListBufer[index]=switchBuffer;

                  appLinker.send(PARTS_LIST,partsListBufer);
                }}>-</button>
              </div>

              <div className='row-start-1 col-start-2 row-span-1 col-span-1'>
                <button className='bg-gray-500 text-right h-full  select-none px-2 font-bold text-lg rounded-md' onClick={()=>{
                  let switchBuffer=partsListBufer[index-1];
                  if(switchBuffer==undefined)
                    return;
                  partsListBufer[index-1]=partsListBufer[index];
                  partsListBufer[index]=switchBuffer;

                  appLinker.send(PARTS_LIST,partsListBufer);
                }}>+</button>
              </div>

              <div className='row-start-1 col-start-3 row-span-1 col-span-1'>
                <button className='bg-red-700 text-right h-full  select-none px-1 font-bold text-lg rounded-md' onClick={()=>{
                  partsListBufer.splice(index, 1);

                  appLinker.send(PARTS_LIST,partsListBufer);
                }}>delete</button>
              </div>

            </div>
          </div>
          <br />
          <div className='text-xs text-gray-500 text-left'>
            {JSON.stringify(element)}
          </div>
        </div>
      </>)
    });
    setPartsList(renderBuffer);
  }

  appLinker.addListener(PARTS_LIST,(data)=>{
    userStorage.set(PARTS_LIST,data);
    partsListBufer=userStorage.get(PARTS_LIST);
    updatePartsList();
  })

  useEffect(()=>{
    appLinker.send(PARTS_LIST,partsListBufer);
  },[]);

  return (
    <>
      <AddComponent component={{
        submit:(part)=>{
          appLinker.send(PARTS_LIST,[...partsListBufer,part])
        }
      }}/>
      {partsList}
    </>

  )
}
