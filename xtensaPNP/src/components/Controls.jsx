import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { userStorage } from '../utils/utils';


export const ControlPanel=({machineControl})=>{
  const buttonStyle='bg-teal-400 text-center h-full w-full';
  const toolControlStyle='border border-gray-500 h-full w-full';
  const tootChangeStyle='rounded-md bg-red-600 p-1 m-1';


  const [toolChangeList,setToolChangeList]=useState([]);
  const [toolControl,setToolControl]=useState(<>tool control</>);

  useEffect(()=>{
    const toolChangeListBuffer=[];

    ((machineControl||{}).toolChangeList||[]).forEach((tool,index) => {


      toolChangeListBuffer.push(
        <button className={`float-left ${tootChangeStyle}`} onClick={()=>{
          ((tool.activate)||(()=>{}))();
          setToolControl(tool.Control||<>undefined</>);
        }}>{tool.label||'tool'}</button>
      );
    });

    setToolChangeList(toolChangeListBuffer);

    console.log(" >> ",userStorage.set('any value',1234));
    console.log(" >> ",userStorage.set('any value2','manga'));

  },[]);


  return(<>
    <div className='float-right w-[300px]  '>
      <input type="number" className='w-full bg-gray-800 rounded-lg h-[45px] text-blue-300 text-4xl text-center' />
      
      <div className='grid grid-cols-5 grid-rows-5 gap-0.5   w-full h-[300px] my-2'>

          {/* <div className='row-start-1 col-start-1 row-end-11 col-end-11'><div className=''></div></div> */}


        <div className='row-start-1 col-start-1 row-span-1 col-span-1'><div className={buttonStyle}>01</div></div>
        <div className='row-start-1 col-start-3 row-span-1 col-span-1'><div className={buttonStyle}>02</div></div>
        <div className='row-start-1 col-start-5 row-span-1 col-span-1'><div className={buttonStyle}>03</div></div>

        <div className='row-start-3 col-start-1 row-span-1 col-span-1'><div className={buttonStyle}>04</div></div>
        <div className='row-start-2 col-start-2 row-span-3 col-span-3'><div className={toolControlStyle}>{toolControl}</div></div>
        <div className='row-start-3 col-start-5 row-span-1 col-span-1'><div className={buttonStyle}>06</div></div>

        <div className='row-start-5 col-start-1 row-span-1 col-span-1'><div className={buttonStyle}>07</div></div>
        <div className='row-start-5 col-start-3 row-span-1 col-span-1'><div className={buttonStyle}>08</div></div>
        <div className='row-start-5 col-start-5 row-span-1 col-span-1'><div className={buttonStyle}>09</div></div>
        
      </div>
      <span>Feed Rate</span>
      <input type="range" className='w-full'/>
      <div className='w-full my-2 overflow-scroll'>
        <div className='min-w-max'>
          {toolChangeList}
        </div>
      </div>
    </div>

  </>);
};



export default function Controls() {
  return (
    <>
      <ControlPanel machineControl={{
        toolChangeList:[
          {},{Control:
            <div>manga</div>
          },{},{},{},{},{}
        ]        
      }}/>
    </>
  )
}
