import React from 'react'


export const ControlPanel=()=>{
  const buttonStyle='bg-teal-400 text-center h-full w-full';
  const toolControlStyle='bg-teal-400 text-center h-full w-full'

  return(<>
    <div className='float-right w-[300px] bg-orange-300 '>
      <input type="number" className='w-full bg-gray-800 rounded-lg h-[45px] text-blue-300 text-4xl text-center' />
      <div className='grid grid-cols-10 grid-rows-10 gap-2  grid-flow-row w-full h-[300px]'>

          <div className='row-start-1 col-start-1 row-end-11 col-end-11'><div className=''></div></div>


        <div className='row-start-2 col-start-1 row-span-2 col-span-2'><div className={buttonStyle}>01</div></div>
        <div className='row-start-2 col-start-5 row-span-2 col-span-2'><div className={buttonStyle}>02</div></div>
        <div className='row-start-2 col-start-9 row-span-2 col-span-2'><div className={buttonStyle}>03</div></div>

        <div className='row-start-5 col-start-1 row-span-2 col-span-2'><div className={buttonStyle}>04</div></div>
        <div className='row-start-4 col-start-3 row-span-6 col-span-6'><div className={toolControlStyle}>05</div></div>
        <div className='row-start-5 col-start-9 row-span-2 col-span-2'><div className={buttonStyle}>06</div></div>

        <div className='row-start-9 col-start-1 row-span-2 col-span-2'><div className={buttonStyle}>07</div></div>
        <div className='row-start-9 col-start-5 row-span-2 col-span-2'><div className={buttonStyle}>08</div></div>
        <div className='row-start-9 col-start-9 row-span-2 col-span-2'><div className={buttonStyle}>09</div></div>



        {/* <div className='row-start-2 col-start-1 row-end-4 col-end-3'><div className={buttonStyle}>01</div></div>
        <div className='row-start-5 col-start-1 row-end-7 col-end-3'><div className={buttonStyle}>04</div></div>
        <div className='row-start-7 col-start-1 row-end-9 col-end-3'><div className={buttonStyle}>07</div></div>

        <div className='row-start-1 col-start-5 row-end-3 col-end-7'><div className={buttonStyle}>02</div></div>
        <div className='row-start-3 col-start-3 row-end-9 col-end-9'><div className={toolControlStyle}>05</div></div>
        <div className='row-start-9 col-start-5 row-end-11 col-end-7'><div className={buttonStyle}>08</div></div>

        <div className='row-start-2 col-start-9 row-end-4 col-end-11'><div className={buttonStyle}>03</div></div>
        <div className='row-start-5 col-start-9 row-end-7 col-end-11'><div className={buttonStyle}>06</div></div>
        <div className='row-start-7 col-start-9 row-end-9 col-end-11'><div className={buttonStyle}>09</div></div> */}
        
        
      </div>

    </div>

  </>);
};



export default function Controls() {
  return (
    <>
      <ControlPanel/>
    </>
  )
}
