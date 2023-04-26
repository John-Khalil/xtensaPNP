import React, { useEffect } from 'react'
import { useRef } from 'react';
import { userStorage } from '../../../backend/utils';

export const SettingsFeild=({inputFeild})=>{
  const formInputStyle='w-full bg-gray-700 rounded-lg text-blue-300 text-xl text-left p-0.5 float-right';
  const defaultConfig='';

  const inputRef=useRef();
  useEffect(()=>{
    // inputRef.current.value=userStorage.get((inputFeild||{}).label||'settings-label')||userStorage.set((inputFeild||{}).label||'settings-label',defaultConfig);
  },[])
  return(
    <>
      <div className='w-full m-1 p-1'>
        <span className='p-1 m-1'>

          {(inputFeild||{}).label||'label'}
        </span>
        <br />
        <div className='float-left w-[75%] m-1 p-1'>
          <input type={(inputFeild||{}).type||'text'} className={formInputStyle} ref={inputRef}/>
        </div>
        <div className='float-right w-[20%] m-1 p-1'>
          <button className='rounded-md bg-green-600 p-1 font-bold' onClick={()=>{

          }}>Submit</button>
        </div>
      </div>
    </>
  );
};

export default function AppSettings() {
  return (
    <>
      <div className='w-[50%]'>
        
        <SettingsFeild/>

      </div>
    </>
  )
}
