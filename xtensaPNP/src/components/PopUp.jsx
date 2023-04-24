import React from 'react'

export default function PopUp({notification}) {
  return (
    <>
        <div className='select-none p-1 my-1 bg-zinc-500 hover:bg-zinc-300 w-full text-lg' onClick={()=>{
            
        }}>
            <div className='h-[20px] w-[20px] float-left'>
                <img src={(notification||{}).icon||''} alt="" />
            </div>
            <span className='float-left'>{(notification||{}).label||'Notification'}</span>

        </div>
    </>
  )
}
