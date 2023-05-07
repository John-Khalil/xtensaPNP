import React from 'react'

export default function Forms({formAttribute}) {
  const formElemntStyle='rounded-lg text-left h-full w-full select-none p-1 font-bold text-lg';
  const formInputString='w-full bg-gray-700 rounded-lg text-blue-300 text-xl text-center float-right';

  

  return (
  <>
    <div className='grid grid-cols-1 grid-rows-2 gap-1 w-full '>
      <div className='row-start-1 col-start-1 row-span-1 col-span-1'>
        <div className='text-center '>
          <img className='w-[50%] ml-[25%]' src="" alt="" />
        </div>
      </div>
      <div className='row-start-2 col-start-1 row-span-1 col-span-1 '>
        <div className='grid grid-cols-2 grid-rows-6 gap-1   w-full '>
          <div className='row-start-1 col-start-1 row-span-1 col-span-1'><div className={formElemntStyle}>
            
            <div className='w-full '>
              <div className='float-left w-[20%]'>
                <span>Name</span>
              </div>
              <div className='float-right w-[80%]'>
                <input className={formInputString} type="text" placeholder=''/>

              </div>
            </div>
            
            

          </div></div>
          <div className='row-start-2 col-start-1 row-span-1 col-span-1'><div className={formElemntStyle}>
                        
          <div className='w-full '>
              <div className='float-left w-[20%]'>
                <span>Email</span>
              </div>
              <div className='float-right w-[80%]'>
                <input className={formInputString} type="email" placeholder=''/>

              </div>
            </div>
            
            
          </div></div>
          <div className='row-start-3 col-start-1 row-span-1 col-span-1'><div className={formElemntStyle}>
            <div className='w-full '>
              <div className='float-left w-[20%]'>
                <span>Phone</span>
              </div>
              <div className='float-right w-[80%]'>
                <input className={formInputString} type="text" placeholder=''/>

              </div>
            </div>
          </div></div>
          <div className='row-start-4 col-start-1 row-span-1 col-span-1'><div className={formElemntStyle}>
            <div className='w-full '>
              <div className='float-left w-[20%]'>
                <span>Type</span>
              </div>
              <div className='float-right w-[80%]'>
                <input className={formInputString} type="text" placeholder=''/>

              </div>
            </div>
          </div></div>
          <div className='row-start-5 col-start-1 row-span-1 col-span-1'><div className={formElemntStyle}>
            <div className='w-full '>
              <div className='float-left w-[20%]'>
                <span>Severity % </span>
              </div>
              <div className='float-right w-[80%]'>
                <input className={formInputString} type="number" placeholder=''/>

              </div>
            </div>
          </div></div>

          <div className='row-start-1 col-start-2 row-span-1 col-span-1'><div className={formElemntStyle}>
            
            <div className='w-full '>
              <div className='float-left w-[20%]'>
                <span>Time</span>
              </div>
              <div className='float-right w-[80%]'>
                <input className={formInputString} type="text" placeholder=''/>

              </div>
            </div>
            
          </div></div>
          <div className='row-start-2 col-start-2 row-span-1 col-span-1'><div className={formElemntStyle}>
            <div className='w-full '>
              <div className='float-left w-[20%]'>
                <span>Place</span>
              </div>
              <div className='float-right w-[80%]'>
                <input className={formInputString} type="text" placeholder=''/>

              </div>
            </div>
          </div></div>
          <div className='row-start-3 col-start-2 row-span-1 col-span-1'><div className={formElemntStyle}>
            <div className='w-full '>
              <div className='float-left w-[20%]'>
                <span>Total</span>
              </div>
              <div className='float-right w-[80%]'>
                <input className={formInputString} type="text" placeholder=''/>

              </div>
            </div>
          </div></div>
          <div className='row-start-4 col-start-2 row-span-1 col-span-1'><div className={formElemntStyle}>
            <div className='w-full '>
              <div className='float-left w-[20%]'>
                <span>Sequential</span>
              </div>
              <div className='float-right w-[80%]'>
                <input className={formInputString} type="text" placeholder=''/>

              </div>
            </div>
          </div></div>
          <div className='row-start-5 col-start-2 row-span-1 col-span-1'><div className={formElemntStyle}>
            <div className='w-full '>
              <div className='float-left w-[20%]'>
                <span>Approved</span>
              </div>
              <div className='float-right w-[80%]'>
                <input className={formInputString} type="text" placeholder=''/>

              </div>
            </div>
          </div></div>

          <div className='row-start-6 col-start-1 row-span-1 col-span-2'><div className={formElemntStyle}>
            <div className='w-[30%]  text-center my-1 bg-green-800 rounded-md float-right'><button onClick={()=>{}}>Approve</button></div>
          </div></div>
        </div>
      </div>

    </div>
    
  </>
    
  )
}
