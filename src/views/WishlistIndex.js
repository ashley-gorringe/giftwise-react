import React, { useState, useRef, useEffect } from 'react';

import { UserGroupIcon, EllipsisHorizontalIcon, PencilSquareIcon, EyeIcon, EyeSlashIcon, TrashIcon, ChevronDownIcon, ChevronUpIcon, PlusCircleIcon } from '@heroicons/react/24/outline';

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

function WishlistSelector() {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(); // Ref for the menu

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

    return (
        <div className={`wishlist-selector ${menuOpen ? '--open' : ''}`}>
            <button className='wishlist-selector-button' onClick={toggleMenu}><span>My Wishlist</span><ChevronDownIcon/></button>
            <div className='wishlist-selector-menu' ref={menuRef}>
                <button className='wishlist-selector-close' onClick={toggleMenu}><span>My Wishlist</span><ChevronUpIcon/></button>
                <button className='wishlist-selector-item'><div className='picture'></div><span>Mum's Wishlist</span></button>
                <button className='wishlist-selector-add'><PlusCircleIcon/><span>New Wishlist</span></button>
            </div>
        </div>
    );
}

function WishlistIndex() {
    return (
        <>
        <div className='wishlist-index-header'>
            <WishlistSelector/>
            <button className='wishlist-add-item-button'><PlusCircleIcon/><span>New Wish</span></button>
        </div>
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
    );
}

export default WishlistIndex;