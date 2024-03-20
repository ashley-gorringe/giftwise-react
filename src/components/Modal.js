import React, { useState, useRef, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

import { XMarkIcon } from '@heroicons/react/24/outline';

import ModalNewWish from './ModalNewWish';
import ModalNewList from './ModalNewList';

function Modal(props){
    const [modalTitle, setModalTitle] = useState(null);
    const [modalData, setModalData] = useState(null);
    const [modalBody, setModalBody] = useState(null);

    const handleClose = () => {
        props.setModalActive(false);
    }
    useEffect(() => {
        // Update modalData state with the new props.modalData
        setModalData(props.modalData);
    }, [props.modalData]); // Ensure the effect runs whenever props.modalData changes
    
    useEffect(() => {
        // Now that modalData is guaranteed to be up-to-date, let's perform the conditional check
        if (modalData && modalData['type'] === 'new-wish') {
            setModalTitle('Add a new wish'); // Correctly call setModalTitle as a function
            setModalBody(<ModalNewWish apiRoot={props.apiRoot} handleClose={handleClose} modalData={modalData} />); // Correctly call setModalBody as a function
        }else if (modalData && modalData['type'] === 'share-list') {
            setModalTitle('Share this List'); // Correctly call setModalTitle as a function
            setModalBody(
                <div className='modal-body'>
                    <p>Coming soon...</p>
                </div>
            );
        }else if (modalData && modalData['type'] === 'new-list') {
            setModalTitle('Create a new Wishlist'); // Correctly call setModalTitle as a function
            setModalBody(
                <ModalNewList apiRoot={props.apiRoot} handleClose={handleClose} modalData={modalData}/>
            );
        }
    }, [modalData]); // This effect depends on modalData
    

    return(
        <>
        <div className={`modal-overlay ${props.modalActive ? '--active' : ''}`} onClick={handleClose}></div>
        <div className={`modal-wrapper ${props.modalActive ? '--active' : ''} ${props.isPwaOnIOS ? '--pwa' : '--no-pwa'}`}>
            <div className="modal">
                <div className='modal-header'>
                    <h2>{modalTitle}</h2>
                    <button className='modal-close' onClick={handleClose}><XMarkIcon/></button>
                </div>
                {modalBody}
            </div>
        </div>
        </>
    );
}

export default Modal;