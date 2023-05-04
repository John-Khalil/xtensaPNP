import React, { useEffect } from 'react'
import appLinker from '../utils/utils'

const PopUp=(notification)=>{
    appLinker.send(((notification||{}).loggerIdentifier||'ALL-EVENTS'),
    <>
        <div className='select-none p-0 my-1 rounded-lg hover:bg-zinc-500 w-full h-[30px] text-lg' onClick={()=>{
            ((notification||{}).onClick||(()=>{}))();
        }}>
            <div className='h-[20px] w-[20px] float-left mt-1 ml-2'>
                <img src={(notification||{}).icon||''} alt="" />
            </div>
            <span className='float-left mx-2 text-white align-middle'>{(notification||{}).label||'Notification'}</span>
            
        </div>
    </>
    );
    

}

export default PopUp;
