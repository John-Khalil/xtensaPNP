import React, { useEffect } from 'react'
import appLinker from '../utils/utils'

const PopUp=(notification)=>{
    appLinker.send('ALL-EVENTS',
    <>
        <div className='select-none p-1 my-1 bg-zinc-800 hover:bg-zinc-500 w-full h-[30px] text-lg' onClick={()=>{
            ((notification||{}).onClick||(()=>{}))();
        }}>
            <div className='h-[20px] w-[20px] float-left'>
                <img src={(notification||{}).icon||''} alt="" />
            </div>
            <span className='float-left mx-2 mb-[5px]  text-white'>{(notification||{}).label||'Notification'}</span>
            
        </div>
    </>
    );
    

}

export default PopUp;
