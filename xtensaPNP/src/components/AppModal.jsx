import React from 'react'
import appLinker from '../utils/utils'
import ReactModal from 'react-modal'
import { useState } from 'react'

export default function AppModal({identifier}) {
    const exitElement=<><button className="float-right inline underline font-bold mr-3" onClick={()=>{setOpen(false);}}>CLOSE</button><br /></>;
    const [openModal,setOpen]=useState(false);
    const [contentModal,setContent]=useState([exitElement]);
    const [backgroundColor,setBackgroundColor]=useState('rgba(30, 30, 30, 0.9)');

    appLinker.addListener(`${identifier}@AppModal-setOpen`,eventData=>setOpen(eventData));
    appLinker.addListener(`${identifier}@AppModal-setContent`,eventData=>setContent([exitElement,eventData]));
    appLinker.addListener(`${identifier}@AppModal-setBackgroundColor`,eventData=>setBackgroundColor(eventData));
    return (
        <div onKeyDown={(event)=>{
            if (event.key === 'Escape')
                setOpen(false);
        }}>
            <ReactModal 
                isOpen={openModal}
                //  shouldCloseOnEsc={true}
                shouldReturnFocusAfterClose={true}
                data={{ background: "green" }}
                style={{
                content: {
                    // maxWidth: '600px',
                    // maxHeight: '400px',
                    margin: 'auto',
                    backgroundColor:backgroundColor,
                    // border: '1px solid #6a6a6a',
                    border: 'none',
                },
                overlay:{
                    backgroundColor:'none',
                },
                }}
                contentElement={
                (props, children) => <div {...props}>{children}</div>
                }
            >
                    {contentModal}
            </ReactModal>
        
        </div>
    )
}
