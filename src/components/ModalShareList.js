import React, { useState, useRef, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import { UserCircleIcon } from '@heroicons/react/24/outline';

function ModalShareList(props){
    const [isLoading, setIsLoading] = useState(true);
    const [shareCode, setShareCode] = useState(null);
    const [people, setPeople] = useState([]);

    useEffect(() => {
        //fetch the people that the list is shared with
        fetch(`${props.apiRoot}/wishlist_share/${props.modalData['wishlist']}?token=${localStorage.getItem('token')}`)
        .then(response => response.json()).then(data => {
            setShareCode(data.share_code);
            setPeople(data.link_accounts);
            setIsLoading(false);
            console.log(data.link_accounts);
        })
        .catch((error) => {
            toast.error('There was an error communicating with the server.');
            setIsLoading(false);
        });
    }, [props.modalData]);

    const handleDelete = (uid) => {
        console.log('delete');
        const toastId = toast.loading('Removing person...');
        fetch(`${props.apiRoot}/wishlist_share/${uid}?token=${localStorage.getItem('token')}`, {
            method: 'DELETE',
        })
        .then(response => response.json()).then(data => {
            if(data.error){
                toast.error(data.error);
            }else{
                toast.success('Person removed.');
                toast.dismiss(toastId);
    
                // Remove the person from the list by filtering and then setting the people state with a new array
                setPeople(prevPeople => {
                    const newPeople = prevPeople.filter(person => person.account_link_uid !== uid);
                    return [...newPeople]; // Spread into a new array to ensure React detects a change
                });
            }
        })
        .catch((error) => {
            toast.error('There was an error communicating with the server.');
        });
    }
    


    function PeopleList(props){
        if(isLoading){
            return(
                <div className='share-people'>
                    <p className='helper-text'>This Wishlist is currently being shared with the following people:</p>
                    <div className='person-skeleton'>
                        <div className='picture'></div>
                        <div className='name'></div>
                    </div>
                    <div className='person-skeleton'>
                        <div className='picture'></div>
                        <div className='name'></div>
                    </div>
                </div>
            );
        }else{
            //if there are no people, show a message
            if(props.people.length === 0){
                return(
                    <div className='share-people'>
                        <p className='helper-text'>This Wishlist is not currently being shared with anyone.</p>
                    </div>
                );
            }else{
                return(
                    <div className='share-people'>
                        <p className='helper-text'>This Wishlist is currently being shared with the following people:</p>
                        {props.people.map((person, index) => {
                            
                            let picture;
                            if(person.image_uid === null){
                                picture = <div className='picture-icon'><UserCircleIcon/></div>;
                            }else{
                                picture = <div className='picture' style={{ backgroundImage: `url(${person.image_url})` }}></div>;
                            }

                            return(
                                <div className='person' key={index}>
                                    {picture}
                                    <div className='name'>{person.account_name}</div>
                                    <button className='button' onClick={() => handleDelete(person.account_link_uid)}>Remove</button>
                                </div>
                            );
                        })}
                    </div>
                );
            }
        }
    };

    return(
        <div className='modal-body'>
            <div className='share-code-group'>
                <label>Share Code</label>
                <div className={`share-code ${isLoading ? '--loading' : ''}`}>
                    <span>{shareCode}</span>
                    <div className="loader"></div>
                </div>
                <div className='error-text'></div>
                <div className='helper-text'>Share this code with another person to let them see your Wishlist.</div>
            </div>
            <PeopleList people={people} handleDelete={handleDelete}/>
        </div>
    );
}
export default ModalShareList;