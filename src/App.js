import { Routes, Route, Link } from 'react-router-dom';

import LogoFull from './logo-full.svg';

import { HomeIcon, QueueListIcon, UserGroupIcon, BellAlertIcon } from '@heroicons/react/24/outline';
import { useLocation } from 'react-router-dom';

function SidebarNav() {
	const location = useLocation();

	return (
		<nav className='sidebar-nav'>
			<Link to="/" className={location.pathname === '/' ? '--active' : ''}><div className='inner'><QueueListIcon/><span>My Wishlist</span></div></Link>
			<Link to="/people" className={location.pathname === '/people' ? '--active' : ''}><div className='inner'><UserGroupIcon/><span>People</span></div></Link>
			<Link to="/activity" className={location.pathname === '/activity' ? '--active' : ''}><div className='inner'><BellAlertIcon/><span>Activity</span></div></Link>
		</nav>
	);
}

function App() {

	const profilePicture = 'https://r2.serverbook.app/user-image/9e1a4260ea970fb37721bd9c968e2db8-medium.jpg';

	return (
		<div className="app">
			<div className="sidebar">
				<div className="logo">
					<a href="/">
						<img src={LogoFull} alt="Logo" />
					</a>
				</div>
				<SidebarNav/>
				<div className="footer">
					<Link className="footer-account" to="/account">
						<div className="picture" style={{ backgroundImage:`url(${profilePicture})` }}></div>
						<div className="body">
							<span>My Account</span>
							<span>Ashley Gorringe</span>
						</div>
					</Link>
					<div className="footer-links">
						<a href="#">Terms</a>
						<a href="#">Privacy</a>
						<a href="#">Support</a>
					</div>
					<span className="footer-copyright">© 2024 Dandylion Technologies.</span>
				</div>
			</div>
			<main>
				<Routes>
					<Route path="/" element={<h1>My Wishlist</h1>} />
					<Route path="/people" element={<h1>People</h1>} />
					<Route path="/activity" element={<h1>Activity</h1>} />
					<Route path="/account" element={<h1>Account</h1>} />
					<Route path="*" element={<h1>Not Found</h1>} />
				</Routes>
			</main>
		</div>
	);
}

export default App;
