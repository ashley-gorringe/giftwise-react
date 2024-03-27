import React, { useState, useRef, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

import { EllipsisHorizontalIcon, PencilSquareIcon, ArrowTopRightOnSquareIcon, TrashIcon, PlusCircleIcon, UserPlusIcon } from '@heroicons/react/24/outline';

function PeopleIndex(props) {
    const [isLoading, setIsLoading] = useState(true);

    const handleNewPerson = () => {
        //event.preventDefault();
        props.setModal({type: 'new-person'});
    };

    return (
        <>
        <div className={`people-index-header`}>
        <h1>People</h1>
        <div className='actions'>
            <button className='new-button' onClick={handleNewPerson}><UserPlusIcon/><span>Add a Person</span></button>
        </div>
        </div>
        <div className='list-section'>
            <div className='empty-notice'>
                <h3>You're not following anyone</h3>
                <p>Giftwise is at it's best when you connect with your Friends & Family. Tap the <strong>Add a Person</strong> button to get started.</p>
                <button className='--primary' onClick={handleNewPerson}><UserPlusIcon/><span>Add a Person</span></button>
            </div>
        </div>
        </>
    );
}

export default PeopleIndex;