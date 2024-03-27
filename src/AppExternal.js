import React, { useState, useRef, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import LogoFull from './logo-full.svg';
import LogoFullGreen from './logo-full-green.svg';
import LogoIcon from './logo-icon.svg';
import LogoTall from './logo-tall.svg';

import SignInBox from './components/SignInBox';

function AppExternal(props){
    return(
        <>
        <Toaster position="top-center"/>
        <div className={`app app-sign-in ${props.isPwaOnIOS ? '--pwa' : '--no-pwa'}`}>
            <div className='structure-sign-in'>
                <img className='logo' src={LogoFullGreen} alt="Logo" />
                <SignInBox apiRoot={props.apiRoot} setIsSignedIn={props.setIsSignedIn} setUser={props.setUser}/>
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
}

export default AppExternal;