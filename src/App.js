import React, { useState, useRef, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';

import AppLoading from './AppLoading';
import AppExternal from './AppExternal';
import AppMain from './AppMain';


function App() {
	const [isLoading, setIsLoading] = useState(true);
	const [isSignedIn, setIsSignedIn] = useState(false);
	const [isIOS, setIsIOS] = useState(false);
    const [isPwaOnIOS, setIsPwaOnIOS] = useState(false);

	const [user, setUser] = useState(null);

	const navigate = useNavigate();

	const apiRoot = window.location.hostname === 'localhost' ? 'http://localhost:8010/proxy' : 'https://api.giftwise.app';

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
			fetch(`${apiRoot}/login_tokens/`+token, {
				method: 'GET',
			}).then(response => response.json()).then(data => {
				if(data.error){
					setIsLoading(false);
				}else{
					//set the user in the app state
					//console.log(data);
					setUser(data.user);
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
			<AppLoading isPwaOnIOS={isPwaOnIOS}/>
		);
	}else{
		if (!isSignedIn) {
			return(
				<AppExternal apiRoot={apiRoot} isPwaOnIOS={isPwaOnIOS} setIsSignedIn={setIsSignedIn} setUser={setUser}/>
			);
		}else{
			return (
				<AppMain apiRoot={apiRoot} isPwaOnIOS={isPwaOnIOS} user={user} handleSignOut={handleSignOut}/>
			);
		}
	}
}

export default App;
