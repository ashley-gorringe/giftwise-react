import React, { useState, useRef, useEffect } from 'react';

import { Routes, Route, Link } from 'react-router-dom';

import LogoFull from './logo-full.svg';
import LogoIcon from './logo-icon.svg';
import LogoTall from './logo-tall.svg';

import { HomeIcon, QueueListIcon, UserGroupIcon, BellAlertIcon } from '@heroicons/react/24/outline';
import { useLocation } from 'react-router-dom';
import WishlistIndex from './views/WishlistIndex';
import SignInBox from './components/SignInBox';

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

function MobileNav() {
	const location = useLocation();

	return (
		<div className='mobile-nav'>
			<Link to="/" className={location.pathname === '/' ? '--active' : ''}><HomeIcon/><span>My Wishlist</span></Link>
			<Link to="/people" className={location.pathname === '/people' ? '--active' : ''}><UserGroupIcon/><span>People</span></Link>
			<Link to="/activity" className={location.pathname === '/activity' ? '--active' : ''}><BellAlertIcon/><span>Activity</span></Link>
		</div>
	);
}

function App() {
	const [isIOS, setIsIOS] = useState(false);
    const [isPwaOnIOS, setIsPwaOnIOS] = useState(false);

	const profilePicture = 'https://r2.serverbook.app/user-image/9e1a4260ea970fb37721bd9c968e2db8-medium.jpg';

	useEffect(() => {
        const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        setIsIOS(isIOSDevice);

        const isInStandaloneMode = ('standalone' in window.navigator) && (window.navigator.standalone);
        setIsPwaOnIOS(isIOSDevice && isInStandaloneMode);
    }, []);

	//if local storage userid is not set
	//redirect to login
	if (!localStorage.getItem('userid')) {
		return(
			<div className={`app app-sign-in ${isPwaOnIOS ? '--pwa' : '--no-pwa'}`}>
				<div className='structure-sign-in'>
					<img className='logo' src={LogoTall} alt="Logo" />
					<SignInBox/>
					<div className='footer'>
						<div className="footer-links">
							<a href="#">Terms</a>
							<a href="#">Privacy</a>
							<a href="#">Support</a>
						</div>
						<span className="footer-copyright">© 2024 Dandylion Technologies.</span>
					</div>
				</div>
			</div>
		);
	}else{
		document.addEventListener('wheel', function(event) {
			var mainBody = document.getElementById('main');
			var toScroll = mainBody.scrollTop + event.deltaY;
		
			// Scroll the main body element
			mainBody.scrollTop = toScroll;
		
			// Prevent the default scroll behavior to avoid scrolling the entire page
			event.preventDefault();
		}, { passive: false });
		return (
			<div className={`app ${isPwaOnIOS ? '--pwa' : '--no-pwa'}`}>
				<div className="top-bar">
					<Link className='logo' to="/">
						<img src={LogoIcon} alt="Logo" />
					</Link>
					<Link className='user' to="/account" style={{ backgroundImage:`url(${profilePicture})` }}></Link>
	
				</div>
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
				<div className='main-inset-shadow'></div>
				<main id='main'>
					<Routes>
						<Route path="/" element={
							<WishlistIndex/>
						} />
						<Route path="/people" element={<h1>People</h1>} />
						<Route path="/activity" element={<h1>Activity</h1>} />
						<Route path="/account" element={<h1>Account</h1>} />
						<Route path="*" element={<h1>Not Found</h1>} />
					</Routes>
				</main>
				<MobileNav/>
			</div>
		);
	}
}

export default App;
