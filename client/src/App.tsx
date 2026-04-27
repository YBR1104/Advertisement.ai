import Navbar from './components/Navbar';
import Home from './pages/Home';
import SoftBackdrop from './components/SoftBackdrop';
import Footer from './components/Footer';
import LenisScroll from './components/lenis';
import { Route, Routes } from 'react-router-dom';
import Generator from './pages/Generator';
import Plan from './pages/Plan';
import Loading from './pages/Loading';
import Result from './pages/Result';
import Mygeneration from './pages/Mygeneration';
import Community from './pages/Community';
import {Toaster} from 'react-hot-toast'

function App() {
	return (
		<>
			<Toaster toastOptions={{style: {background: '#ffffff', color: '#334155', border: '1px solid rgba(15,23,42,0.1)', borderRadius: '999px', boxShadow: '0 8px 24px rgba(2,6,23,0.08)'}}}/>
			<SoftBackdrop />
			<LenisScroll />
			<Navbar />
			<Routes><Route path ='/' element={<Home />}/>
					<Route path ='/generate' element={<Generator />}/>
					<Route path ='/plan' element={<Plan />}/>
					<Route path ='/loading' element={<Loading />}/>
					<Route path ='/result/:projectId' element={<Result />}/>
					<Route path ='/my-generation' element={<Mygeneration />}/>
					<Route path ='/community' element={<Community />}/>
			</Routes>
			
			<Footer />
		</>
	);
}
export default App;
