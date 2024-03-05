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

function ListItem(props) {
	const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(); // Ref for the menu

    // Toggle menu function
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    useEffect(() => {
        // Function to check if clicked outside
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };

        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuRef]);
	
	return(
		<div className={`list-item-wrapper ${menuOpen ? '--menu-open' : ''}`}>
			<button className='list-item-menu-button' onClick={toggleMenu}><EllipsisHorizontalIcon/></button>
			<a href="#" className='list-item'>
				<div className='image' style={{ backgroundImage: 'url('+props.thumbnailSrc+')' }}></div>
				<div className='body'>
					<h4>{props.name}</h4>
					<span className='price'>{props.price}</span>
				</div>
			</a>
			<div ref={menuRef} className='list-item-menu'>
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
							<ListItem name="Some Android Smart Watch" price="£199.99" thumbnailSrc="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHNtYXJ0JTIwd2F0Y2h8ZW58MHwwfDB8fHww"/>
							<ListItem name="Noise Cancelling Headphones" price="£79.99" thumbnailSrc="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGVhZHBob25lc3xlbnwwfDB8MHx8fDA%3D"/>
							<ListItem name="Polestar 2 - Dual Motor Long Range" price="£56,422.00" thumbnailSrc="https://images.unsplash.com/photo-1626275035543-b15a5a67d74d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cG9sZXN0YXJ8ZW58MHwwfDB8fHww"/>
							<ListItem name="Uncomfortable designer chair" price="£235.00" thumbnailSrc="https://images.unsplash.com/photo-1554104707-a76b270e4bbb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y2hhaXJ8ZW58MHwwfDB8fHww"/>
							<ListItem name="Brightly Coloured Socks" price="£12.50" thumbnailSrc="https://images.unsplash.com/photo-1535488407783-1c7c7152e48a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzl8fHNvY2tzfGVufDB8MHwwfHx8MA%3D%3D"/>
							<ListItem name="Xbox Controller" price="£67.99" thumbnailSrc="https://images.unsplash.com/photo-1605640194512-2f7440046c2a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8eGJveCUyMGNvbnRyb2xsZXJ8ZW58MHwwfDB8fHww"/>
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
