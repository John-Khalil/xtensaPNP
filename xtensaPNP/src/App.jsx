import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from './layouts/Layout';
import HomePage from './components/HomePage';
import ConsoleDynamic from './components/ConsoleDynamic';
import NotFound from './components/NotFound';
import AppSettings from './components/AppSettings';
import SmartHub from './components/SmartHub';
import Controls from './components/Controls';
import SensorData from './components/SensorData';
import Logs from './components/Logs';
import { useEffect } from 'react';
import { execuatableSetup } from './utils/operators';
import WebSocketSetup from './utils/WebSocketClient';
import appLinker, { SERVICE_RUNNER } from './utils/utils';




function App() {
	useEffect(()=>{
		execuatableSetup();
		WebSocketSetup();
		appLinker.addListener(SERVICE_RUNNER,serviceRunner=>{
			if(typeof serviceRunner === 'function')
				(async()=>{
					serviceRunner();
				})();
		})
	},[]);
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<Layout/>}>
					<Route index element={<HomePage/>}/>
					<Route path="home" element={<HomePage />} />
					<Route path='smart-hub' element={<SmartHub/>}/>
					<Route path="console-dynamic" element={<ConsoleDynamic />} />
					<Route path="app-settings" element={<AppSettings />} />
					<Route path="app-controls" element={<Controls/>} />
					<Route path="app-sensor-data" element={<SensorData/>} />
					<Route path="app-logs" element={<Logs/>} />
					<Route path="*" element={<NotFound />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
