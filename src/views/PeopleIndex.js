import React, { useState, useRef, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

import { EllipsisHorizontalIcon, PencilSquareIcon, ArrowTopRightOnSquareIcon, TrashIcon, PlusCircleIcon, UserPlusIcon, UserCircleIcon } from '@heroicons/react/24/outline';

function ListItem(props) {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(); // Ref for the menu

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


    const handleDelete = (event) => {
        event.preventDefault();
        props.handleDelete(props.account_link_uid);
        setMenuOpen(false); // Dismiss the menu
    };

    let picture;
    if(props.image === null){
        picture = <div className='image-icon'><UserCircleIcon/></div>;
    }else{
        picture = <div className='image' style={{ backgroundImage: `url(${props.image})` }}></div>;
    }

    return (
        <div className={`item-wrapper ${menuOpen ? '--menu-open' : ''}`}>
            <button className='item-menu-button' onClick={toggleMenu}><EllipsisHorizontalIcon/></button>
            <Link to={`/people/${props.account_uid}`} className='person-item'>
                {picture}
                <h4>{props.name}</h4>
            </Link>
            <div ref={menuRef} className='item-menu'>
                <a className='--danger' href="#" onClick={handleDelete}><TrashIcon/><span>Remove</span></a>
            </div>
        </div>
    );
}
function ListItemSkeleton() {
    return(
        <div className='person-item-skeleton'>
            <div className='image'></div>
            <span></span>
        </div>
    );
}

function PeopleIndex(props) {
    const [isLoading, setIsLoading] = useState(true);
    const [people, setPeople] = useState([]);

    useEffect(() => {
        //console.log(wishlists);

        fetch(`${props.apiRoot}/wishlist_share?token=${localStorage.getItem('token')}`, {
            method: 'GET',
        }).then(response => response.json()).then(data => {
            if (data.error) {
                toast.error(data.error);
                //setIsLoading(false);
            } else {
                setIsLoading(false);
                setPeople(data.link_accounts);
            }
        }).catch((error) => {
            toast.error('There was an error communicating with the server.');
            setIsLoading(false);
        });
    }, []);

    const handleNewPerson = () => {
        //event.preventDefault();
        props.setModal({type: 'new-person'});
    };
    const handleDeletePerson = (uid) => {
        //loading toast
        const toastId = toast.loading('Removing Person...');
        fetch(`${props.apiRoot}/wishlist_share/${uid}?token=${localStorage.getItem('token')}`, {
            method: 'DELETE',
        })
        .then(response => response.json()).then(data => {
            if(data.error){
                toast.error(data.error);
            }else{
                toast.success('Person removed.');
                toast.dismiss(toastId);

                setPeople(people => people.filter(person => {
                    // Logging for debugging
                    //console.log(`Comparing ${person.account_link_uid} with ${uid}`);
                    return person.account_link_uid !== uid;
                }));
            }
        })
        .catch((error) => {
            toast.error('There was an error communicating with the server.');
        });
    };

    if (isLoading) {
        return (
            <>
            <div className={`people-index-header`}>
            <h1>People</h1>
            <div className='actions'>
                <button className='new-button'><UserPlusIcon/><span>Add a Person</span></button>
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
            <div className={`people-index-header`}>
            <h1>People</h1>
            <div className='actions'>
                <button className='new-button' onClick={handleNewPerson}><UserPlusIcon/><span>Add a Person</span></button>
            </div>
            </div>
            <div className='list-section'>
                {people.length > 0 ? (
                    <div className='grid'>
                    {people.map((person, index) => (
                        <ListItem key={index} image={person.image_url} name={person.account_name} account_uid={person.account_uid} account_link_uid={person.account_link_uid} handleDelete={handleDeletePerson} />
                    ))}
                    </div>
                ) : (
                    <div className='empty-notice'>
                        <h3>You're not following anyone</h3>
                        <p>Giftwise is at it's best when you connect with your Friends & Family. Tap the <strong>Add a Person</strong> button to get started.</p>
                        <button className='--primary' onClick={handleNewPerson}><UserPlusIcon/><span>Add a Person</span></button>
                    </div>
                )}
            </div>
            </>
        );
    }
}

export default PeopleIndex;