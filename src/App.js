import React, { useState, useRef, useEffect } from 'react';

import { Routes, Route, Link, useNavigate } from 'react-router-dom';

import LogoFull from './logo-full.svg';
import LogoIcon from './logo-icon.svg';
import LogoTall from './logo-tall.svg';

import toast, { Toaster } from 'react-hot-toast';
import { HomeIcon, QueueListIcon, UserGroupIcon, BellAlertIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useLocation } from 'react-router-dom';
import WishlistIndex from './views/WishlistIndex';
import NewWish from './views/NewWish';

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
	const [isLoading, setIsLoading] = useState(true);
	const [isSignedIn, setIsSignedIn] = useState(false);
	const [isIOS, setIsIOS] = useState(false);
    const [isPwaOnIOS, setIsPwaOnIOS] = useState(false);

	const [user, setUser] = useState(null);

	const navigate = useNavigate();

	const apiRoot = 'http://localhost:8010/proxy';
	const profilePicture = 'https://r2.serverbook.app/user-image/9e1a4260ea970fb37721bd9c968e2db8-medium.jpg';

	useEffect(() => {
        const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        setIsIOS(isIOSDevice);

        const isInStandaloneMode = ('standalone' in window.navigator) && (window.navigator.standalone);
        setIsPwaOnIOS(isIOSDevice && isInStandaloneMode);
    }, []);

	//check if local storage has a token
	useEffect(() => {
		const token = localStorage.getItem('token');
		if(token){
			//check if the token is valid
			fetch(`${apiRoot}/login_tokens/`+token, {
				method: 'GET',
			}).then(response => response.json()).then(data => {
				if(data.error){
					setIsLoading(false);
				}else{
					//set the user in the app state
					setUser(data.user);
					console.log(data.user);
					//set the user as signed in
					setIsSignedIn(true);
					setIsLoading(false);
				}
			}
			).catch((error) => {
				toast.error('There was an error communicating with the server.');
				//setIsLoading(false);
			}
			);


		}else{
			setIsLoading(false);
		}
	}, []);

	const handleSignOut = () => {
		localStorage.removeItem('token');
		setIsSignedIn(false);
		setUser(null);
		navigate('/');
		toast.success('You have been signed out.');
	};


	
	if(isLoading){
		return(
			<>
			<Toaster position="bottom-center"/>
			<div className={`app app-sign-in ${isPwaOnIOS ? '--pwa' : '--no-pwa'}`}>
				<div className='structure-loading'>
					<img className='logo' src={LogoTall} alt="Logo" />
					<span className="loader"></span>
				</div>
			</div>
			</>
		);
	}else{
		if (!isSignedIn) {
			return(
				<>
				<Toaster position="top-center"/>
				<div className={`app app-sign-in ${isPwaOnIOS ? '--pwa' : '--no-pwa'}`}>
					<div className='structure-sign-in'>
						<img className='logo' src={LogoTall} alt="Logo" />
						<SignInBox apiRoot={apiRoot} setIsSignedIn={setIsSignedIn} setUser={setUser}/>
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
				</>
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
				<>
				<Toaster position="bottom-center"/>
				<div className={`app ${isPwaOnIOS ? '--pwa' : '--no-pwa'}`}>
					<div className="top-bar">
						<Link className='logo' to="/">
							<img src={LogoIcon} alt="Logo" />
						</Link>
						<Link className='user-default' to="/account"><UserCircleIcon/></Link>
		
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
								<div className="picture-default"><UserCircleIcon/></div>
								<div className="body">
									<span>My Account</span>
									<span>{user.name_full}</span>
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
							<Route path="/new" element={
								<NewWish apiRoot={apiRoot}/>
							} />
							<Route path="/people" element={<h1>People</h1>} />
							<Route path="/activity" element={<h1>Activity</h1>} />
							<Route path="/account" element={
								<>
								<h1>Account</h1>
								<button className='button' onClick={handleSignOut}><span>Sign Out</span></button>
								</>
							} />
							<Route path="*" element={<h1>Not Found</h1>} />
						</Routes>
					</main>
					<MobileNav/>
				</div>
				</>
			);
		}
	}
}

export default App;
