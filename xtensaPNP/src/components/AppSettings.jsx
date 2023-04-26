import React, { useEffect } from 'react'
import { useRef } from 'react';
import { userStorage,WEBSOCKET_REMOTE_HOST,WEBSOCKET_REMOTE_PORT,WEBSOCKET_REMOTE_PATH,CAMERA_CONFIG,MOTIONCONTROLLER_IP,MOTIONCONTROLLER_PORT,MOTIONCONTROLLER_PATH} from '../utils/utils';


export const SettingsFeild=({inputFeild})=>{
  const formInputStyle='w-full bg-gray-700 rounded-lg text-blue-300 text-xl text-left p-0.5 float-right';
  const defaultConfig=(inputFeild||{}).defaultConfig||'';

  const inputRef=useRef();
  useEffect(()=>{
    inputRef.current.value=userStorage.get((inputFeild||{}).label||'settings-label')||userStorage.set((inputFeild||{}).label||'settings-label',defaultConfig);
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
            userStorage.set((inputFeild||{}).label||'settings-label',inputRef.current.value);
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
        
        <SettingsFeild inputFeild={{
          label:WEBSOCKET_REMOTE_HOST
        }}/>
        <SettingsFeild inputFeild={{
          label:WEBSOCKET_REMOTE_PORT,
          type:'number'
        }}/>
        <SettingsFeild inputFeild={{
          label:WEBSOCKET_REMOTE_PATH
        }}/>
        <SettingsFeild inputFeild={{
          label:CAMERA_CONFIG
        }}/>
        <SettingsFeild inputFeild={{
          label:MOTIONCONTROLLER_IP
        }}/>
        <SettingsFeild inputFeild={{
          label:MOTIONCONTROLLER_PORT
        }}/>
        <SettingsFeild inputFeild={{
          label:MOTIONCONTROLLER_PATH
        }}/>

      </div>
    </>
  )
}
