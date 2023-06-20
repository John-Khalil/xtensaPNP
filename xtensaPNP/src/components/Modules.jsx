import React, { useEffect, useState } from 'react'
import { useRef } from 'react';
import { pipeline } from '../utils/operators';
import appLinker, { ANALOG_READ, EXECUATABLE_REPORT_STATUS } from '../utils/utils';
// import Chart from 'chart.js';

import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";


const LineChart = ({graphData}) => {
  const chartData = {
    labels: graphData.labels,
    datasets: [
      {
        label: 'Line Chart',
        data: graphData.data,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  return <Line data={chartData} />;
};



export const ServoControl=({})=>{
	const formInputString='bg-gray-700 rounded-lg text-blue-300 text-xl text-center m-1 p-1';
	const servoAngle=useRef();
	const servoChannel=useRef();
	return (
		<>
			<div className='rounded-lg bg-gray-800 m-1 p-4 w-content'>
				<span className='m-1 p-1 font-extrabold'>Servo Control</span>
				<br />
				<span className='m-1 p-1 font-extrabold'>Channel</span>
				<input type="number" className={formInputString} ref={servoChannel}/>
				<br />
				<span className='m-1 p-1 font-extrabold'>Degree</span>
				<input type="number" className={formInputString} ref={servoAngle}/>
				<br />
				<button className='bg-green-500 px-4 rounded-lg text-2xl font-extrabold m-1 p-1 text-center pb-2' onClick={()=>{
					new pipeline().servoControl((((servoChannel.current.value||0)>32)?0:servoChannel.current.value),((servoAngle.current.value||90)>179)?179:servoAngle.current.value).run();
				}}>apply</button>
				<br />
			</div>
			{/* <button className='bg-yellow-500' onClick={()=>{
				new pipeline().analogRead(36,(data)=>{

				}).run();
			}}>test adc</button> */}
		</>
	);
}
export const Modules=({})=>{
	let [tempReading,setTempReading]=useState({
		data:[],
		labels:[]
	})
	let dataCount=0;
	useEffect(()=>{
		appLinker.addListener(EXECUATABLE_REPORT_STATUS,statusObject=>{
			if(((statusObject||{}).ID=='analogInput')&&((statusObject||{}).ch==36)){
				console.log("temp",(statusObject||{}).INPUT_VALUE*0.08)
				let objectBuffer=tempReading;
				objectBuffer.data.push((statusObject||{}).INPUT_VALUE*0.08);
				objectBuffer.labels.push(dataCount++);
				tempReading=objectBuffer;
				// setTempReading(objectBuffer);
			}
		})
		setInterval(()=>{
			new pipeline().analogRead(36,(data)=>{

			}).run();
			setTempReading(JSON.parse(JSON.stringify(tempReading)));
		},1500)
	},[])
	return(
		<>
			<LineChart graphData={tempReading}/>
			<br />
			<ServoControl/>
		</>
	);
}