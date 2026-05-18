import Home from './pages/Home';
import { Navigate, Route, Routes } from 'react-router-dom';
import Generator from './pages/Generator';
import Plan from './pages/Plan';
import Loading from './pages/Loading';
import Result from './pages/Result';
import Mygeneration from './pages/Mygeneration';
import Community from './pages/Community';
import { Toaster } from 'react-hot-toast';
import { Loader2Icon } from 'lucide-react';
import { useUser } from '@clerk/react';
import DashboardLayout from './components/DashboardLayout';
import Settings from './pages/Settings';
import Profile from './pages/Profile';

function App() {
	const { user, isLoaded } = useUser();

	if (!isLoaded) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-slate-950">
				<Loader2Icon className="size-8 animate-spin text-violet-300" />
			</div>
		);
	}

	return (
		<>
			<Toaster
				toastOptions={{
					style: {
						background: '#11111a',
						color: '#f4f4f5',
						border: '1px solid rgba(167,139,250,0.35)',
						borderRadius: '14px',
						boxShadow: '0 16px 36px rgba(0,0,0,0.45)',
					},
				}}
			/>

			{!user ? (
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="*" element={<Navigate to="/" replace />} />
				</Routes>
			) : (
				<Routes>
					<Route element={<DashboardLayout />}>
						<Route path="/" element={<Navigate to="/dashboard/image" replace />} />
						<Route path="/dashboard/image" element={<Generator />} />
						<Route path="/dashboard/video" element={<Mygeneration />} />
						<Route path="/settings" element={<Settings />} />
						<Route path="/profile/*" element={<Profile />} />
						<Route path="/result/:projectId" element={<Result />} />
						<Route path="/plan" element={<Plan />} />
						<Route path="/community" element={<Community />} />
						<Route path="/loading" element={<Loading />} />
						<Route path="/generate" element={<Navigate to="/dashboard/image" replace />} />
						<Route path="/my-generation" element={<Navigate to="/dashboard/video" replace />} />
						<Route path="*" element={<Navigate to="/dashboard/image" replace />} />
					</Route>
				</Routes>
			)}
		</>
	);
}
export default App;
