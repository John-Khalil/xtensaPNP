import React from 'react'
import { useRef } from 'react';

export const AddComponent=({component})=>{
  const formInputString='w-full bg-gray-700 rounded-lg text-blue-300 text-xl text-center float-right';
    const pcb_x=useRef();
    const pcb_y=useRef();
    const pcb_z=useRef();

    const partWidth=useRef();
    const partHeight=useRef();
    const partLength=useRef();
    const partOrientation=useRef();
    const partTray=useRef();
    
    return (
        <>
            <span className='text-2xl font-black'>PCB</span>
            <div className='grid grid-cols-3 grid-rows-1 gap-1   w-[50%] h-[300px] my-2'>
              <div className='row-start-1 col-start-1 row-span-1 col-span-1'>
                <span>X-Coordinate</span>
                <input className={formInputString} type="text" ref={pcb_x}/>
              </div>
              <div className='row-start-1 col-start-2 row-span-1 col-span-1'>
                <span>Y-Coordinate</span>
                <input className={formInputString} type="text" ref={pcb_y}/>
              </div>
              <div className='row-start-1 col-start-3 row-span-1 col-span-1'>
                <span>Z-Coordinate</span>
                <input className={formInputString} type="text" ref={pcb_z}/>
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
