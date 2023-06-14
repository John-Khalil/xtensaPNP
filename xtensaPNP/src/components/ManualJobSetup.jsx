import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useRef } from 'react';
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
                <input className={formInputString} type="number" ref={partLabel}/>
              </div>
              <div className='row-start-1 col-start-5 row-span-1 col-span-1'>
                <span><pre> </pre></span>
                <button className='bg-green-600 text-xl text-center w-full rounded-lg' onClick={()=>{
                  ((component||{}).submit||(()=>{}))({
                    pcb_x:pcb_x.current.value,
                    pcb_y:pcb_y.current.value,
                    pcb_z:pcb_z.current.value,
                    partLabel:partLabel.current.value,
                    partWidth:partWidth.current.value,
                    partHeight:partHeight.current.value,
                    partLength:partLength.current.value,
                    partOrientation:partOrientation.current.value,
                    partTray:partTray.current.value,
                  });
                }}>Add</button>
              </div>
            </div>

            
        </>
    )
}

export default function ManualJobSetup() {
  let partsListBufer=userStorage.get(PARTS_LIST)||userStorage.set(PARTS_LIST,[]);
  const [partsList,setPartsList]=useState([]);

  const updatePartsList=()=>{
    let renderBuffer=[];
    partsListBufer.forEach((element,index) => {
      renderBuffer.push(<>
        <div className='bg-gray-900 rounded-md w-full text-left p-4 my-1'>
          <span>{element.label||'label'}</span>
          <div className='float-right'>
            <div className='grid grid-cols-3 grid-rows-1 gap-1  w-fit '>

              <div className='row-start-1 col-start-1 row-span-1  col-span-1'>
                <button className='bg-gray-500 text-right h-full  select-none px-2 font-bold text-lg rounded-md' onClick={()=>{
                  let switchBuffer=partsListBufer[index+1];
                  partsListBufer[index+1]=partsListBufer[index];
                  partsListBufer[index]=switchBuffer;

                  appLinker.send(PARTS_LIST,partsListBufer);
                }}>-</button>
              </div>

              <div className='row-start-1 col-start-2 row-span-1 col-span-1'>
                <button className='bg-gray-500 text-right h-full  select-none px-2 font-bold text-lg rounded-md' onClick={()=>{
                  let switchBuffer=partsListBufer[index-1];
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
          appLinker.send(PARTS_LIST,[...partsListBufer,{...part,index:partsListBufer.length}])
        }
      }}/>
      {partsList}
    </>

  )
}
