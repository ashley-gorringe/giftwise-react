import React, { useState, useRef, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';

import { HomeIcon, QueueListIcon, UserGroupIcon, BellAlertIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import LogoFull from './logo-full.svg';
import LogoIcon from './logo-icon.svg';
import LogoTall from './logo-tall.svg';

import WishlistIndex from './views/WishlistIndex';
import NewWish from './views/NewWish';

function AppMain(props){

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

    useEffect(() => {
        const handleWheel = (event) => {
            var mainBody = document.getElementById('main');
            if (mainBody) {
                var toScroll = mainBody.scrollTop + event.deltaY;
                mainBody.scrollTop = toScroll;
                event.preventDefault();
            }
        };

        // Add the event listener
        document.addEventListener('wheel', handleWheel, { passive: false });

        // Cleanup function to remove the event listener
        return () => {
            document.removeEventListener('wheel', handleWheel, { passive: false });
        };
    }, []);

    function SidebarProfilePicture() {

        if(props.user['picture'] !== null){
            return (
                <div className="picture" style={{ backgroundImage: 'url('+props.user.picture+')' }}></div>
            );
        }else{
            return (
                <div className="picture-default">
                    <UserCircleIcon/>
                </div>
            );
        }
    }

    function MobileProfilePicture() {
        if(props.user['picture'] !== null){
            return (
                <Link className='user' to="/account" style={{ backgroundImage: 'url('+props.user.picture+')' }}></Link>
            );
        }else{
            return (
                <Link className='user-default' to="/account"><UserCircleIcon/></Link>
            );
        }
    }

    const handleSignOut = () => {
        props.handleSignOut();
    }

    return(
        <>
        <Toaster position="bottom-center"/>
        <div className={`app ${props.isPwaOnIOS ? '--pwa' : '--no-pwa'}`}>
            <div className="top-bar">
                <Link className='logo' to="/">
                    <img src={LogoIcon} alt="Logo" />
                </Link>
                <MobileProfilePicture/>

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
                        <SidebarProfilePicture/>
                        <div className="body">
                            <span>My Account</span>
                            <span>{props.user.name_preferred}</span>
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
                        <WishlistIndex apiRoot={props.apiRoot} user={props.user} />
                    } />
                    <Route path="/new" element={
                        <NewWish apiRoot={props.apiRoot} user={props.user}/>
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
};

export default AppMain;