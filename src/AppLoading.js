import React, { useState, useRef, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import LogoFull from './logo-full.svg';
import LogoIcon from './logo-icon.svg';
import LogoTall from './logo-tall.svg';

function AppLoading(props){
    return(
        <>
        <Toaster position="bottom-center"/>
        <div className={`app app-sign-in ${props.isPwaOnIOS ? '--pwa' : '--no-pwa'}`}>
            <div className='structure-loading'>
                <img className='logo' src={LogoTall} alt="Logo" />
                <span className="loader"></span>
            </div>
        </div>
        </>
    );
};

export default AppLoading;