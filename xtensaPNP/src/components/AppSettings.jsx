import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useRef } from 'react';
import ReactJson from 'react-json-view';
import { userStorage,WEBSOCKET_REMOTE_HOST,WEBSOCKET_REMOTE_PORT,WEBSOCKET_REMOTE_PATH,CAMERA_CONFIG,MOTIONCONTROLLER_IP,MOTIONCONTROLLER_PORT,MOTIONCONTROLLER_PATH, HTTP_SERVER_ADDRESS,HTTP_SERVER_PORT,HTTP_SERVER_PATH,MAIN_IP,MAIN_HTTP_PORT,MAIN_PORT,MAIN_PATH} from '../utils/utils';


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

  const [serverLocalStorage,setServerLocalStorage]=useState(<></>);

  const loadServerConfig=(serverConfig)=>{
    axios.post(`http://${
      userStorage.get(HTTP_SERVER_ADDRESS)||userStorage.set(HTTP_SERVER_ADDRESS,MAIN_IP)
    }:${
      userStorage.get(HTTP_SERVER_PORT)||userStorage.set(HTTP_SERVER_PORT,MAIN_HTTP_PORT)
    }${
      userStorage.get(HTTP_SERVER_PATH)||userStorage.set(HTTP_SERVER_PATH,MAIN_PATH)
    }`,{
      requestType:'SERVER_CONFIG',
      serverConfig
    }).then(response=>{
      setServerLocalStorage(
        <div className='bg-neutral-300'><ReactJson name={false} src={response.data} theme="monokai" onEdit={(userUpdate)=>{
          loadServerConfig(userUpdate.updated_src);
          return true;    //this return would enable the user edit
        }}/></div>
      )
    }).catch(error=>{
      <div className='text-red'>couldn't load server config</div>
    })
  }

  useEffect(()=>{
    
  },[]);
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
      <span>APP-CONFIG</span>
      <div className='bg-neutral-300'><ReactJson name={false} src={userStorage.storage()} theme="monokai" onEdit={(userUpdate)=>{
        userStorage.storage(userUpdate.updated_src);
        return true;    //this return would enable the user edit
      }}/></div>

      <button onClick={()=>{
        loadServerConfig();
      }}>SERVER_CONFIG</button>
      {serverLocalStorage}
      
    </>
  )
}
