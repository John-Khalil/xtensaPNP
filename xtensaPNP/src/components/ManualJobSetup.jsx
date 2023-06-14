import React from 'react'
import { useRef } from 'react';

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
                <button className='bg-green-600 text-xl text-center w-full rounded-lg'>Add</button>
              </div>
            </div>

            
        </>
    )
}

export default function ManualJobSetup() {
  return (
    <AddComponent component={{

    }}/>
  )
}
