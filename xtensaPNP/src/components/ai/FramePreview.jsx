import React from 'react'

export default function FramePreview({objectDetcted}) {
  return (
    <>
        <div className='float-left p-1 m-1'>
            <img src={((objectDetcted||{}).dataURL||'')} alt="" />
        </div>
        <div className='float-right p-1 mx-1 mt-[100px] text-4xl text-left'>
            <span>{`Model : ${((objectDetcted||{}).modelName||'UNDEFINED :-(')}`}</span>
            <br />
            <span>{`Object Count : ${((objectDetcted||{}).objectCount||'UNDEFINED :-(')}`}</span>

            
            {((objectDetcted||{}).onApprove!=undefined)?<>
                <br />
                <br />
                <button className='bg-green-500 m-2 p-2 font-bold float-right' onClick={()=>{
                    ((objectDetcted||{}).onApprove||(()=>{}))();
                }}>Approve</button>
            </>:<></>}
            
            

        </div>
    </>
  )
}
