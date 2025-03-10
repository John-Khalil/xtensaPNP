import React,{ useState,useEffect,useRef } from "react"
import appLinker, { userStorage } from "../utils/utils";

// const userCommands=[];
// let userCommandsIndex=0;

export const DynamicConsole=({userConsole})=>{
	let defaultTextColor='green';
	let defaultThemeColor='green';
	const consoleIdentifier=userConsole.consoleIdentifier||'ALL-USERS';

	const consoleInput=userConsole.consoleInput|false;
	const consoleOutput=userConsole.consoleOutput|true;

	const mainConsoleOutput=useRef();
	const mainConsoleInput=useRef();
	const consoleEnableNL=useRef();
	const consoleEnableCR=useRef();

	const [userCommands,setUserCommands]=useState([]);
	const [userCommandsIndex,setUserCommandsIndex]=useState(0);

	const [consoleDataObjects,setConsoleDataObjects]=useState([]);

	const clearMainConsoleOutput=()=>{
		// mainConsoleOutput.current.innerHTML='';
		setConsoleDataObjects([]);
	}

	const consoleSend=()=>{
		if(!(mainConsoleInput.current.value||[]).length)
			return;

		userConsole.send({
			consoleIdentifier,
			consoleData:`${mainConsoleInput.current.value}${consoleEnableCR.current.checked?'\r':''}${consoleEnableCR.current.checked?'\n':''}`
		});
		// userCommands.push(mainConsoleInput.current.value);
		// userCommandsIndex=userCommands.length;
		setUserCommandsIndex(userCommands.length+1);
		setUserCommands([...userCommands,mainConsoleInput.current.value]);
		mainConsoleInput.current.value='';
	}

	const hitEnter=keyDownEvent=>{
		// console.log("keyDownEvent > ",keyDownEvent.key); //^ get the value for any key from the console
		if(keyDownEvent.key==='Enter')
			consoleSend();

		if((keyDownEvent.key==='ArrowDown') && (userCommands[userCommandsIndex+1]!=undefined )){
			mainConsoleInput.current.value=userCommands[userCommandsIndex+1];
			setUserCommandsIndex(userCommandsIndex+1);							//! this will not change the value untill the proccess end
		}
		
		if((keyDownEvent.key==='ArrowUp') && (userCommands[userCommandsIndex-1]!=undefined )){
			mainConsoleInput.current.value=userCommands[userCommandsIndex-1];
			setUserCommandsIndex(userCommandsIndex-1);							//! this will not change the value untill the proccess end
		}

		if(!((keyDownEvent.key==='ArrowUp')||(keyDownEvent.key==='ArrowDown')||(keyDownEvent.key==='Enter'))) 
			setUserCommandsIndex(userCommands.length);
	}




	useEffect(()=>{
		if(userConsole.clearConsole===true)
			clearMainConsoleOutput();

		if(userConsole.consoleData!==undefined){
			// mainConsoleOutput.current.innerHTML+=userConsole.consoleData;
			setConsoleDataObjects([...consoleDataObjects,userConsole.consoleData]);
			// (async()=>{
			// 	mainConsoleOutput.current.scrollTop=mainConsoleOutput.current.scrollHeight;

			// })();
		}

	},[userConsole]);

	useEffect(()=>{
		mainConsoleOutput.current.scrollTop=mainConsoleOutput.current.scrollHeight;

	},[consoleDataObjects]);

	useEffect(()=>{
		if(consoleInput){
			consoleEnableNL.current.checked=(userStorage.get(`consoleEnableNL-@${consoleIdentifier}`)==undefined)?userStorage.set(`consoleEnableNL-@${consoleIdentifier}`,true):userStorage.get(`consoleEnableNL-@${consoleIdentifier}`);
			consoleEnableCR.current.checked=(userStorage.get(`consoleEnableCR-@${consoleIdentifier}`)==undefined)?userStorage.set(`consoleEnableCR-@${consoleIdentifier}`,true):userStorage.get(`consoleEnableCR-@${consoleIdentifier}`);
		}
	},[]);

	return(
		<>
			<div className={`p-1 m-1 overflow-scroll min-w-1000 rounded-lg  ${userConsole.className||'float-left lg:w-[45%] w-[calc(100% -16)] '}`} style={{
				border:`1px solid ${userConsole.themeColor||defaultThemeColor}`,
				color:userConsole.textColor||defaultTextColor,
				display:`${userConsole.hide?'none':''}`
			}}>

				<div className={`w-[calc(100% -24)] p-1 m-1 overflow-scroll rounded-lg bg-black`} style={{
					border:`1px solid ${userConsole.themeColor||defaultThemeColor}`,
					color:'white',
					background:userConsole.themeColor||defaultThemeColor
				}}>
					<span className="float-left inline text-white font-bold" style={{}}>{consoleIdentifier}</span>
					<button className="float-right inline underline font-bold mr-3" onClick={()=>{
						clearMainConsoleOutput();
					}}>CLEAR</button>
				</div>

				{(consoleOutput)?(
					<pre className={`w-[calc(100% -24)]  m-1 p-1 overflow-scroll font-bold`} ref={mainConsoleOutput} style={{
						height:`${userConsole.height||320}px`
					}}>
						{/* {userConsole.consoleData} */}
						{consoleDataObjects}
					</pre>
				):(<></>)}

				{(consoleInput)?(
				
					<div className={`w-[calc(100% -24)] p-1 m-1 overflow-scroll rounded-lg bg-black`} style={{
						border:`1px solid ${userConsole.themeColor||defaultThemeColor}`,
						color:userConsole.textColor||defaultTextColor
					}}>

						<input type="text" ref={mainConsoleInput} className="p-1 m-1 rounded-lg bg-white mt-3 font-semibold" style={{
							border:`1px solid ${userConsole.themeColor||defaultThemeColor}`,
							color:userConsole.textColor||defaultTextColor,
							width:'calc(100% - 123px)'
						}} placeholder=" > Enter Command" onKeyDown={hitEnter}/>

						{/* <div className="w-[calc(100% -150px)]">
							<input type="text" ref={mainConsoleInput} className="p-1 m-1 rounded-lg bg-white mt-3 font-semibold" style={{
								border:`1px solid ${userConsole.themeColor||defaultThemeColor}`,
								color:userConsole.textColor||defaultTextColor,
								width:'inherit'
							}} placeholder=" > Enter Command"/>
						</div>						 */}
						

						<div className="float-right p-1 block">
							<div className="block">
								<input type="checkbox" ref={consoleEnableNL} className="inline-block float-right m-1 mt-1.5 mr-1 p-1" onChange={()=>{
									console.log(consoleEnableNL.current.checked)
									userStorage.set(`consoleEnableNL-@${consoleIdentifier}`,consoleEnableNL.current.checked);
								}}/>
								<span className="inline-block float-right mr-1 text-white">CR</span>
							</div>
							<div className="block">
								<input type="checkbox" ref={consoleEnableCR} className="inline-block float-right m-1 mt-1.5 mr-1 p-1" onChange={()=>{
									userStorage.set(`consoleEnableCR-@${consoleIdentifier}`,consoleEnableCR.current.checked);
								}}/>
								<span className="inline-block float-right mr-1 text-white">NL</span>
							</div>
							
						</div>

						<button className={`m-1 p-1 pl-2 pr-2 inline rounded-lg float-right mt-3`} style={{
							border:`1px solid ${userConsole.themeColor||defaultThemeColor}`,
							color:"white",
							background:userConsole.themeColor||defaultThemeColor
						}} onClick={()=>{
							consoleSend();
						}}>Send</button>
					</div>
				
				):(<></>)}

				
			</div>
		</>
	);
}

export default function ConsoleDynamic() {

	const [consoleLog,consoleLogger]=useState(<>
		<div className="bg-fuchsia-400"> test</div>
	</>);
	let testCounter=0;
	const getConsoleInput=(consoleInput)=>{
		console.log(consoleInput.consoleIdentifier);
		consoleLogger(consoleInput.consoleData);
		setTimeout(() => {
			consoleLogger(undefined);
		}, 0);
	}
	useEffect(()=>{
		
	},[]);
	return (
		<>
			<DynamicConsole userConsole={{
				consoleInput:true,
				// clearConsole:true,
				// themeColor:'yellow',
				// height:200,
				consoleData:consoleLog,
				send:getConsoleInput,
				hide:false,
				// textColor:'yellow'
				// themeColor:'rgb(0,0,0)'


			}}/>

			{/* <DynamicConsole userConsole={{
				consoleInput:true,
				// clearConsole:true,
				// themeColor:'yellow',
				height:200,
				// consoleData:consoleLog,
				// send:getConsoleInput,
				hide:false,
				textColor:'#a855f7',
				themeColor:'#a855f7',
				consoleIdentifier:'USER 2'



			}}/> */}
		</>
	)
}
