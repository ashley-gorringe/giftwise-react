import React, { useState, useRef, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';

import { HomeIcon, QueueListIcon, UserGroupIcon, BellAlertIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import LogoFull from './logo-full.svg';
import LogoFullGreen from './logo-full-green.svg';
import LogoIcon from './logo-icon.svg';
import LogoTall from './logo-tall.svg';

import WishlistIndex from './views/WishlistIndex';
import PeopleIndex from './views/PeopleIndex';
import PeopleSingle from './views/PeopleSingle';
import Modal from './components/Modal';

function AppMain(props){
    const [modalData, setModalData] = useState(null);
    const [modalActive, setModalActive] = useState(false);

    const setModal = (data) => {
        setModalData(data);
        setModalActive(true);
    };

    const closeModal = () => {
        document.querySelector('.modal-wrapper').classList.remove('--active');
        document.querySelector('.modal-overlay').classList.remove('--active');

        setTimeout(() => {
            setModalActive(false);
            setModalData(null);
        }, 200);
    };

    function SidebarNav() {
        const location = useLocation();

        function AccountMenuItem(){
            if(props.user['picture']) {
                return (
                    <Link to="/account" className={location.pathname === '/account' ? '--active' : ''}><div className='inner'><div className='picture' style={{ backgroundImage: 'url('+props.user['picture']+')' }}></div><span>My Account</span></div></Link>
                );
            }else{
                return (
                    <Link to="/account" className={location.pathname === '/account' ? '--active' : ''}><div className='inner'><UserCircleIcon/><span>My Account</span></div></Link>
                );
            }
        }
    
        return (
            <nav className='sidebar-nav'>
                <Link to="/" className={location.pathname === '/' ? '--active' : ''}><div className='inner'><QueueListIcon/><span>My Wishlist</span></div></Link>
                <Link to="/people" className={location.pathname === '/people' ? '--active' : ''}><div className='inner'><UserGroupIcon/><span>People</span></div></Link>
                <AccountMenuItem/>
            </nav>
        );
    }
    
    function MobileNav() {
        const location = useLocation();

        function AccountMenuItem(){
            if(props.user['picture']) {
                return (
                <Link to="/account" className={location.pathname === '/account' ? '--active' : ''}><div className='picture' style={{ backgroundImage: 'url('+props.user['picture']+')' }}></div><span>My Account</span></Link>
                );
            }else{
                return (
                    <Link to="/account" className={location.pathname === '/account' ? '--active' : ''}><UserCircleIcon/><span>My Account</span></Link>
                );
            }
        }
    
        return (
            <div className='mobile-nav'>
                <Link to="/" className={location.pathname === '/' ? '--active' : ''}><HomeIcon/><span>My Wishlist</span></Link>
                <Link to="/people" className={location.pathname === '/people' ? '--active' : ''}><UserGroupIcon/><span>People</span></Link>
                <AccountMenuItem/>
            </div>
        );
    }

    const handleSignOut = () => {
        props.handleSignOut();
    }

    return(
        <>
        <Toaster position="top-center"/>
        {modalActive && (
            <Modal isPwaOnIOS={props.isPwaOnIOS} apiRoot={props.apiRoot} modalData={modalData} modalActive={modalActive} setModalActive={setModalActive} closeModal={closeModal}/>
        )}
        <div className={`app ${props.isPwaOnIOS ? '--pwa' : '--no-pwa'}`}>
            <div className="top-bar">
                <Link className='logo' to="/">
                    <img src={LogoFullGreen} alt="Logo" />
                </Link>
            </div>
            <div className="sidebar">
                <div className="logo">
                    <Link to="/">
                        <img src={LogoFull} alt="Logo" />
                    </Link>
                </div>
                <SidebarNav/>
                <div className="footer">
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
                        <WishlistIndex apiRoot={props.apiRoot} user={props.user} setModal={setModal}  />
                    } />
                    <Route path="/people" element={
                        <PeopleIndex apiRoot={props.apiRoot} user={props.user} setModal={setModal}  />
                    } />
                    <Route path="/people/:uid" element={
                        <PeopleSingle apiRoot={props.apiRoot} user={props.user} setModal={setModal}  />
                    } />
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