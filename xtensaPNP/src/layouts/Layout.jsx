import React, { useState,useEffect } from 'react'
import {Link,Outlet} from 'react-router-dom'

import '../App.css';

export default function Layout() {
	const navBarStyleElements='felx p-1 text-center inline-block bg-fuchsia-700 rounded-md hover:bg-fuchsia-950 w-18 font-bold';
	const navBarStyle='m-1 p-1 text-left border border-fuchsia-700 rounded-md';
	const layoutBodyStyle='m-1 p-1 text center  border-sky-800';
	const navBarHeight=67;
	const [windowHeight,setWindowHeight]=useState((window.innerHeight-navBarHeight))
	useEffect(()=>{
		window.addEventListener("resize",()=>{
			setWindowHeight(window.innerHeight-navBarHeight);
		},false);
	},[])
  return (
    <div className=''>
			<nav className={navBarStyle}>
				<Link to="/home"> <div className={navBarStyleElements}>Home</div> </Link>
				{/* <Link to="/smart-hub"> <div className={navBarStyleElements}>Smart Hub</div> </Link> */}
				<Link to="/app-controls"> <div className={navBarStyleElements}>Controls</div> </Link>
				<Link to="/app-sensor-data"> <div className={navBarStyleElements}>SensorData</div> </Link>
				<Link to="/app-logs"> <div className={navBarStyleElements}>Logs</div> </Link>
				<Link to="/app-settings"> <div className={navBarStyleElements}>Settings</div> </Link>
      			<Link to="/console-dynamic"> <div className={navBarStyleElements}>Console</div> </Link>
			</nav>
			<div className={layoutBodyStyle}>
				<div className='w-full divHeight overflow-scroll' style={{'--height':`${windowHeight}px`}}>
					<Outlet/>
				</div>
			</div>
    </div>
  )
}
