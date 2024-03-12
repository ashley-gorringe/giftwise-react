import React, { useState, useRef, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

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
function ListItemSkeleton() {
    return(
        <div className='list-item-skeleton'>
            <div className='image'></div>
            <div className='body'>
                <span></span>
                <span></span>
            </div>
        </div>
    );
}

function WishlistSelector(props) {
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

    function AccountItem(props) {
        return (
            <button className='wishlist-selector-item'><div className='picture'></div><span>{props.name_full}</span></button>
        );
    }

    return (
        <div className={`wishlist-selector ${menuOpen ? '--open' : ''}`}>
            <button className='wishlist-selector-button' onClick={toggleMenu}><span>My Wishlist</span><ChevronDownIcon/></button>
            <div className='wishlist-selector-menu' ref={menuRef}>
                <button className='wishlist-selector-close' onClick={toggleMenu}><span>My Wishlist</span><ChevronUpIcon/></button>
                {props.accounts.map((account, index) => (
                    <AccountItem key={index} name_full={account.name_full} />
                ))}
                <button className='wishlist-selector-add'><PlusCircleIcon/><span>New Wishlist</span></button>
            </div>
        </div>
    );
}

function WishlistIndex(props) {
    const [isLoading, setIsLoading] = useState(true);
    const [wishlistUid, setWishlistUid] = useState(props.user.primary_account);
    const [items, setItems] = useState([]);

    useEffect(() => {
        
        fetch(`${props.apiRoot}/wishlists/${wishlistUid}?token=${localStorage.getItem('token')}`, {
            method: 'GET',
        })
        .then(response => response.json()).then(data => {
            
            if(data.error){
                toast.error(data.error);
                setIsLoading(false);
            }else{
                setIsLoading(false);
                setItems(data.items);
            }

        })
        .catch((error) => {
            toast.error('There was an error communicating with the server.');
            setIsLoading(false);
        }
        );

    }, []);

    if (isLoading) {
        return (
            <>
            <div className='wishlist-index-header'>
                <div className='wishlist-selector-skeleton'></div>
                <Link to="/new" className='wishlist-add-item-button'><PlusCircleIcon/><span>New Wish</span></Link>
            </div>
            <div className='list-section'>
                <div className='section-header'>
                    <span></span>
                    <h3>Just a sec...</h3>
                    <span></span>
                </div>
                <div className='grid'>
                    
                    <ListItemSkeleton/>
                    <ListItemSkeleton/>
                    <ListItemSkeleton/>
                    <ListItemSkeleton/>
                    <ListItemSkeleton/>
                    <ListItemSkeleton/>
                </div>
            </div>
            </>
        );
    }else{
        return (
            <>
            <div className='wishlist-index-header'>
                <WishlistSelector accounts={props.user.accounts} />
                <Link to="/new" className='wishlist-add-item-button'><PlusCircleIcon/><span>New Wish</span></Link>
            </div>
            <div className='list-section'>
                <div className='section-header'>
                    <span></span>
                    <h3>Visible to only me</h3>
                    <span></span>
                </div>
                <div className='grid'>
                    {items.map((item, index) => (
                        <ListItem key={index} name={item.title} price={0} thumbnailSrc="" />
                    ))}
                </div>
            </div>
            </>
        );
    }
}

export default WishlistIndex;