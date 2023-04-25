import React from 'react';
import { useState } from 'react';
import ReactJson from 'react-json-view';

export default function RunningJobElement({statusObject}) {

    const [preview,setPreview]=useState('');

    const runningJobStyle='select-none p-1 my-1 bg-zinc-800 hover:bg-zinc-500 w-full h-[30px] text-lg';
    const runningJobIDStyle='text-red-400 ml-2 float-left';
    const runningJobStatusLabelStyle='text-amber-200 ml-4 float-left';

    (statusObject||{}).ID=((statusObject||{}).ID||(statusObject||{}).gcode);

    return (
        <>
            <div className={runningJobStyle} onClick={()=>{
                setPreview((preview=='')?<div className='bg-neutral-300'><ReactJson name={false} src={statusObject||{}}/></div>:'');
            }}>
                <div className={runningJobIDStyle}>
                    {(statusObject||{}).ID||'ID'}
                </div>
                <div className={runningJobStatusLabelStyle}>
                    {(statusObject||{}).statusLabel||'statusLabel'}
                </div>
            </div>
            {preview}
        </>
    )
}
