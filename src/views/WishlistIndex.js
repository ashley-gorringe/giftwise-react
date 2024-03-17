import React, { useState, useRef, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

import Placeholder1 from '../placeholder-1.svg';
import Placeholder2 from '../placeholder-2.svg';
import Placeholder3 from '../placeholder-3.svg';
import Placeholder4 from '../placeholder-4.svg';

import { UserGroupIcon, EllipsisHorizontalIcon, PencilSquareIcon, EyeIcon, EyeSlashIcon, TrashIcon, ChevronDownIcon, ChevronUpIcon, PlusCircleIcon } from '@heroicons/react/24/outline';

function ListItem(props) {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(); // Ref for the menu

    // Initialize placeholderNum only once on the first render
    const [placeholderNum] = useState(() => Math.floor(Math.random() * 4) + 1);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuRef]);

    let thumbnailSrc;
    if (placeholderNum === 1) {
        thumbnailSrc = Placeholder1;
    } else if (placeholderNum === 2) {
        thumbnailSrc = Placeholder2;
    } else if (placeholderNum === 3) {
        thumbnailSrc = Placeholder3;
    } else if (placeholderNum === 4) {
        thumbnailSrc = Placeholder4;
    }
    if (props.images) {
        thumbnailSrc = props.images['500'];
    }

    let price = '£ -';
    if (props.price) {
        price = '£ ' + props.price;
    }

    const handleDelete = (event) => {
        event.preventDefault();
        props.handleDelete(props.uid);
        setMenuOpen(false); // Dismiss the menu
    };

    const handleEdit = (event) => {
        event.preventDefault();
        toast('Coming soon!');
    };
    const handlePrivacy = (event) => {
        event.preventDefault();
        toast('Coming soon!');
    };

    return (
        <div key={props.key} className={`list-item-wrapper ${menuOpen ? '--menu-open' : ''}`}>
            <button className='list-item-menu-button' onClick={toggleMenu}><EllipsisHorizontalIcon/></button>
            <a href="#" className='list-item'>
                <div className='image' style={{ backgroundImage: 'url('+thumbnailSrc+')' }}></div>
                <div className='body'>
                    <h4>{props.name}</h4>
                    <span className='price'>{price}</span>
                </div>
            </a>
            <div ref={menuRef} className='list-item-menu'>
                <a href="#" onClick={handleEdit}><PencilSquareIcon/><span>Edit</span></a>
                <a href="#" onClick={handlePrivacy}><EyeSlashIcon/><span>Private</span></a>
                <a href="#" onClick={handlePrivacy}><EyeIcon/><span>Public</span></a>
                <div className='divider'></div>
                <a className='--danger' href="#" onClick={handleDelete}><TrashIcon/><span>Delete</span></a>
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

    const handleItemDelete = (uid) => {
        //loading toast
        const toastId = toast.loading('Deleting item...');
        fetch(`${props.apiRoot}/items/${uid}?token=${localStorage.getItem('token')}`, {
            method: 'DELETE',
        })
        .then(response => response.json()).then(data => {
            if(data.error){
                toast.error(data.error);
            }else{
                toast.success('Item deleted.');
                toast.dismiss(toastId);

                setItems(items => items.filter(item => item.item_uid !== uid));
            }
        })
        .catch((error) => {
            toast.error('There was an error communicating with the server.');
        });
    };

    if (isLoading) {
        return (
            <>
            <div className='wishlist-index-header'>
                <div className='wishlist-selector-skeleton'></div>
                <Link to="/new" className='wishlist-add-item-button'><PlusCircleIcon/><span>New Wish</span></Link>
            </div>
            <div className='list-section'>
                {/* <div className='section-header'>
                    <span></span>
                    <h3>Just a sec...</h3>
                    <span></span>
                </div> */}
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
                {/* <div className='section-header'>
                    <span></span>
                    <h3>Visible to only me</h3>
                    <span></span>
                </div> */}
                <div className='grid'>
                    {items.map((item, index) => (
                        <ListItem key={index} uid={item.item_uid} name={item.title} price={item.value} images={item.images} handleDelete={handleItemDelete}  />
                    ))}
                </div>
            </div>
            </>
        );
    }
}

export default WishlistIndex;