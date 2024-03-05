import React, { useState, useRef, useEffect } from 'react';

import { Routes, Route, Link } from 'react-router-dom';

import LogoFull from './logo-full.svg';
import LogoIcon from './logo-icon.svg';

import { HomeIcon, QueueListIcon, UserGroupIcon, BellAlertIcon, EllipsisHorizontalIcon, PencilSquareIcon, EyeIcon, EyeSlashIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useLocation } from 'react-router-dom';


document.addEventListener('wheel', function(event) {
	var mainBody = document.getElementById('main');
	var toScroll = mainBody.scrollTop + event.deltaY;

	// Scroll the main body element
	mainBody.scrollTop = toScroll;

	// Prevent the default scroll behavior to avoid scrolling the entire page
	event.preventDefault();
}, { passive: false });

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

function ListItem() {
	// State to manage whether the menu is open or not
    const [menuOpen, setMenuOpen] = useState(false);

    // Function to toggle the menu state
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };
	
	return(
		<div className={`list-item-wrapper ${menuOpen ? '--menu-open' : ''}`}>
			<button className='list-item-menu-button' onClick={toggleMenu}><EllipsisHorizontalIcon/></button>
			<a href="#" className='list-item'>
				<div className='image' style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=2599&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)' }}></div>
				<div className='body'>
					<h4>Some Android Smart Watch wrga gwergwerg arghaerh aewrhaerhaerh aehaerh aehhaerhae</h4>
					<span className='price'>£199.99</span>
				</div>
			</a>
			<div className='list-item-menu'>
				<a href="#"><PencilSquareIcon/><span>Edit</span></a>
				<a href="#"><EyeSlashIcon/><span>Private</span></a>
				<a href="#"><UserGroupIcon/><span>Friends & Family</span></a>
				<a href="#"><EyeIcon/><span>Public</span></a>
				<div className='divider'></div>
				<a className='--danger' href="#"><TrashIcon/><span>Delete</span></a>
			</div>
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

	return (
		<div className={`app ${isPwaOnIOS ? '--pwa' : '--no-pwa'}`}>
			<div className="top-bar">
				<Link className='logo' to="/">
					<img src={LogoIcon} alt="Logo" />
				</Link>
				<a className='user' href="/account" style={{ backgroundImage:`url(${profilePicture})` }}></a>

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
			<main id='main'>
				<Routes>
					<Route path="/" element={
					<>
					<h1>My Wishlist</h1>
					<div className='list-section'>
						<div className='section-header'>
							<span></span>
							<h3>Visible to only me</h3>
							<span></span>
						</div>
						<div className='grid'>
							<ListItem/>
							<ListItem/>
							<ListItem/>
							<ListItem/>
							<ListItem/>
							<ListItem/>
							<ListItem/>
							<ListItem/>
						</div>
					</div>
					</>
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

export default App;
