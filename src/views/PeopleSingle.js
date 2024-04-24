import React, { useState, useRef, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

import Placeholder1 from '../placeholder-1.svg';
import Placeholder2 from '../placeholder-2.svg';
import Placeholder3 from '../placeholder-3.svg';
import Placeholder4 from '../placeholder-4.svg';

import { EllipsisHorizontalIcon, PencilSquareIcon, ArrowTopRightOnSquareIcon, TrashIcon, PlusCircleIcon, UserPlusIcon, UserCircleIcon } from '@heroicons/react/24/outline';

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

    const handleViewItem = (event) => {
        event.preventDefault();

        let item = {
            name: props.name,
            url: props.url,
            price: price,
            image: thumbnailSrc,
            notes: props.description,
        };

        props.handleViewItem(item);
    }

    return (
        <div className={`item-wrapper ${menuOpen ? '--menu-open' : ''}`}>
            <div className='list-item' onClick={handleViewItem}>
                <div className='image' style={{ backgroundImage: 'url('+thumbnailSrc+')' }}></div>
                <div className='body'>
                    <h4>{props.name}</h4>
                    <span className='price'>{price}</span>
                </div>
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

function PeopleSingle(props) {
    let params = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [wishlistUid, setWishlistUid] = useState(params.uid);
    const [items, setItems] = useState([]);
    const [wishlistName, setWishlistName] = useState(null);
    const [wishlistImage, setWishlistImage] = useState(null);

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
                setWishlistName(data.wishlist.account_name);
                setWishlistImage(data.wishlist.image_url);
            }
        }).catch((error) => {
            toast.error('There was an error communicating with the server.');
            setIsLoading(false);
        });
    }, [wishlistUid]);

    const handleViewItem = (item) => {
        //event.preventDefault();
        props.setModal({type: 'view-item', item: item});
    };

    if (isLoading) {
        return (
            <>
            <div className={`wishlist-index-header`}>
                <div className='wishlist-person-title'>
                    <div className='picture-icon'><UserCircleIcon/></div>
                    <div className='title-skeleton'></div>
                </div>
            </div>
            <div className='list-section'>
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
            <div className={`wishlist-index-header`}>
                <div className='wishlist-person-title'>
                    {
                        wishlistImage ?
                        <div className='picture' style={{ backgroundImage: 'url('+wishlistImage+')' }}></div> :
                        <div className='picture-icon'><UserCircleIcon/></div>
                    }
                    <h1>{wishlistName}</h1>
                </div>
                <div className='actions'>
                    <button className='wishlist-selector-edit'><EllipsisHorizontalIcon/></button>
                </div>
            </div>
            <div className='list-section'>
            {items.length > 0 ? (
                <div className='grid'>
                {items.map((item, index) => (
                    <ListItem key={index} uid={item.item_uid} name={item.title} url={item.url} price={item.value} images={item.images} description={item.description} handleViewItem={handleViewItem}  />
                ))}
                </div>
            ) : (
                <div className='empty-notice'>
                <h3>This wishlist is empty</h3>
                <p>Check back soon to see if {wishlistName} has added any items to their list.</p>
                </div>
            )}
            </div>
            </>
        );
    }
}

export default PeopleSingle;