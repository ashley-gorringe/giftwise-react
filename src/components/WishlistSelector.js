import React, { useState, useRef, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import { ChevronDownIcon, ChevronUpIcon, PlusCircleIcon } from '@heroicons/react/24/outline';

function WishlistSelector(props) {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(); // Ref for the menu

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

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handleNewList = () => {
        props.handleNewList();
        setMenuOpen(false);
    };

    function ListItem(props) {
        const handleChangeWishlist = (account_uid) => {
            return () => {
                props.handleChangeWishlist(account_uid);
                setMenuOpen(false);
            }
        }

        return (
            <button className={`wishlist-selector-item ${props.image ? '--has-image' : ''}`} onClick={handleChangeWishlist(props.account_uid)}>
                {props.image ? <div className='picture' style={{ backgroundImage: 'url('+props.image+')' }}></div> : null}
                <span>{props.text}</span>
            </button>
        );
    }

    // Find the current wishlist's name using the account_uid
    const currentWishlistName = props.wishlists.find(wishlist => wishlist.account_uid === props.currentWishlist)?.name_full;
    // Find the current wishlist's image using the account_uid
    const currentWishlistImage = props.wishlists.find(wishlist => wishlist.account_uid === props.currentWishlist)?.image_uid;

    // Filter out the currentWishlist before mapping
    const filteredWishlists = props.wishlists.filter(wishlist => wishlist.account_uid !== props.currentWishlist);

    if (props.primaryWishlist === props.currentWishlist) {
        return (
            <div className={`wishlist-selector ${menuOpen ? '--open' : ''}`}>
                <button className='wishlist-selector-button' onClick={toggleMenu}><span>My Wishlist</span><ChevronDownIcon/></button>
                <div className='wishlist-selector-menu' ref={menuRef}>
                    <button className='wishlist-selector-close' onClick={toggleMenu}><span>My Wishlist</span><ChevronUpIcon/></button>
                    {filteredWishlists.map((wishlist) => (
                        <ListItem key={wishlist.account_uid} account_uid={wishlist.account_uid} text={wishlist.name_full} image={wishlist.image_uid} handleChangeWishlist={props.handleChangeWishlist} />
                    ))}
                    <button className='wishlist-selector-add' onClick={handleNewList}><PlusCircleIcon/><span>New Wishlist</span></button>
                </div>
            </div>
        );
    } else {
        return (
            <div className={`wishlist-selector ${menuOpen ? '--open' : ''}`}>
                <button className={`wishlist-selector-button ${currentWishlistImage ? '--has-image' : ''}`} onClick={toggleMenu}>{currentWishlistImage ? <div className='picture' style={{ backgroundImage: 'url('+currentWishlistImage+')' }}></div> : null}<span>{currentWishlistName}</span><ChevronDownIcon/></button>

                <div className='wishlist-selector-menu' ref={menuRef}>
                    <button className={`wishlist-selector-close ${currentWishlistImage ? '--has-image' : ''}`} onClick={toggleMenu}>{currentWishlistImage ? <div className='picture' style={{ backgroundImage: 'url('+currentWishlistImage+')' }}></div> : null}<span>{currentWishlistName}</span><ChevronUpIcon/></button>
                    <ListItem key={props.primaryWishlist} account_uid={props.primaryWishlist} text="My Wishlist" image={null} handleChangeWishlist={props.handleChangeWishlist} />
                    {filteredWishlists.map((wishlist) => (
                        <ListItem key={wishlist.account_uid} account_uid={wishlist.account_uid} text={wishlist.name_full} image={wishlist.image_uid} handleChangeWishlist={props.handleChangeWishlist} />
                    ))}
                    <button className='wishlist-selector-add' onClick={handleNewList}><PlusCircleIcon/><span>New Wishlist</span></button>
                </div>
            </div>
        );
    }
}

export default WishlistSelector;
