import React, { useState, useRef, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

import Placeholder1 from '../placeholder-1.svg';
import Placeholder2 from '../placeholder-2.svg';
import Placeholder3 from '../placeholder-3.svg';
import Placeholder4 from '../placeholder-4.svg';

import { EllipsisHorizontalIcon, PencilSquareIcon, EyeIcon, EyeSlashIcon, TrashIcon, PlusCircleIcon, UserPlusIcon } from '@heroicons/react/24/outline';

import WishlistSelector from '../components/WishlistSelector';

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
        setMenuOpen(false); // Dismiss the menu
    };
    const handlePrivacy = (event) => {
        event.preventDefault();
        toast('Coming soon!');
        setMenuOpen(false); // Dismiss the menu
    };

    return (
        <div className={`list-item-wrapper ${menuOpen ? '--menu-open' : ''}`}>
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

function WishlistIndex(props) {
    const [isLoading, setIsLoading] = useState(true);
    const [wishlistUid, setWishlistUid] = useState(props.user.primary_account);
    const [wishlists, setWishlists] = useState(props.user.wishlists);
    const [items, setItems] = useState([]);
    
    /* 
    const getWishlists = () => {
        fetch(`${props.apiRoot}/wishlists?token=${localStorage.getItem('token')}`, {
            method: 'GET',
        }).then(response => response.json()).then(data => {
            if (data.error) {
                toast.error(data.error);
            } else {
                setWishlists(data.wishlists);
            }
        }).catch((error) => {
            toast.error('There was an error communicating with the server.');
        });
    }; */

    const getItems = () => {
        //console.log('Getting items...');
        fetch(`${props.apiRoot}/wishlists/${wishlistUid}?token=${localStorage.getItem('token')}`, {
            method: 'GET',
        }).then(response => response.json()).then(data => {
            if (data.error) {
                toast.error(data.error);
            } else {
                setItems(data.items);
            }
        }).catch((error) => {
            toast.error('There was an error communicating with the server.');
        });
    };

    useEffect(() => {
        //console.log(wishlists);

        fetch(`${props.apiRoot}/wishlists/${wishlistUid}?token=${localStorage.getItem('token')}`, {
            method: 'GET',
        }).then(response => response.json()).then(data => {
            if (data.error) {
                toast.error(data.error);
                setIsLoading(false);
            } else {
                setIsLoading(false);
                setItems(data.items);
            }
        }).catch((error) => {
            toast.error('There was an error communicating with the server.');
            setIsLoading(false);
        });
    }, [wishlistUid]);

    const handleChangeWishlist = (uid) => {
        //console.log('Changing wishlist to ' + uid);
        setIsLoading(true);
        setWishlistUid(uid);
    };

    const handleNewWish = () => {
        //event.preventDefault();
        props.setModal({type: 'new-wish', wishlist: wishlistUid, getItems: getItems});
    };
    const handleShareList = () => {
        //event.preventDefault();
        props.setModal({type: 'share-list', wishlist: wishlistUid});
    };
    const handleNewList = () => {
        //event.preventDefault();
        props.setModal({type: 'new-list', setWishlistUid: setWishlistUid, handleChangeWishlist: handleChangeWishlist, setWishlists: setWishlists});
    };
    const handleEditList = () => {
        //event.preventDefault();
        props.setModal({type: 'edit-list', wishlist: wishlistUid, primaryWishlist: props.user.primary_account, handleChangeWishlist: handleChangeWishlist, setWishlists: setWishlists});
    };


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
            <div className={`wishlist-index-header ${wishlistUid !== props.user.primary_account ? '--has-edit' : ''} `}>
            <WishlistSelector wishlists={wishlists} primaryWishlist={props.user.primary_account} currentWishlist={wishlistUid} handleNewList={handleNewList} handleChangeWishlist={handleChangeWishlist}  />
            <div className='actions'>
                {wishlistUid !== props.user.primary_account ? <button className='wishlist-selector-edit' onClick={handleEditList}><EllipsisHorizontalIcon/></button> : null}
                <button onClick={handleShareList}><UserPlusIcon/><span>Share</span></button>
                <button className='new-button --primary' onClick={handleNewWish}><PlusCircleIcon/><span>New Wish</span></button>
            </div>
            </div>
            <div className='list-section'>
            {/* <div className='section-header'>
                <span></span>
                <h3>Visible to only me</h3>
                <span></span>
            </div> */}
            
            {items.length > 0 ? (
                <div className='grid'>
                {items.map((item, index) => (
                    <ListItem key={index} uid={item.item_uid} name={item.title} price={item.value} images={item.images} handleDelete={handleItemDelete}  />
                ))}
                </div>
            ) : (
                <div className='empty-notice'>
                <h3>Your wishlist is empty</h3>
                <p>Tap the <strong>New Wish</strong> button to get started. Jot down anything that sparks joy or piques your interest. </p>
                <button className='--primary' onClick={handleNewWish}><PlusCircleIcon/><span>New Wish</span></button>
                </div>
            )}
            </div>
            </>
        );
    }
}

export default WishlistIndex;