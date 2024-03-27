import React, { useState, useRef, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import { UserCircleIcon } from '@heroicons/react/24/outline';

function ModalShareList(props){
    const [isLoading, setIsLoading] = useState(true);
    const [shareCode, setShareCode] = useState(null);

    useEffect(() => {
        //fetch the people that the list is shared with
        fetch(`${props.apiRoot}/wishlist_share/${props.modalData['wishlist']}?token=${localStorage.getItem('token')}`)
        .then(response => response.json()).then(data => {
            setShareCode(data.share_code);
            setIsLoading(false);
        })
        .catch((error) => {
            toast.error('There was an error communicating with the server.');
            setIsLoading(false);
        });
    }, [props.modalData]);

    function PeopleList(){
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
            return(
                <div className='share-people'>
                    <p className='helper-text'>This Wishlist is currently being shared with the following people:</p>
                    <div className='person'>
                        <div className='picture' style={{ backgroundImage: 'url(https://r2.giftwise.app/be86c44e7386d6d6fd32627283c087cb5ab4_100.jpg)' }}></div>
                        <div className='name'>John Doe</div>
                        <button className='button'>Remove</button>
                    </div>
                    <div className='person'>
                        <div className='picture-icon'><UserCircleIcon/></div>
                        <div className='name'>John Doe</div>
                        <button className='button'>Remove</button>
                    </div>
                </div>
            );
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
            <PeopleList/>
        </div>
    );
}
export default ModalShareList;