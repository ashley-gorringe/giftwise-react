import React, { useState, useRef, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

import { XMarkIcon } from '@heroicons/react/24/outline';

import ModalNewWish from './ModalNewWish';
import ModalNewList from './ModalNewList';
import ModalEditList from './ModalEditList';
import ModalShareList from './ModalShareList';
import ModalViewItem from './ModalViewItem';
import ModalNewPerson from './ModalNewPerson';

function Modal(props){
    const [modalTitle, setModalTitle] = useState(null);
    const [modalData, setModalData] = useState(null);
    const [modalBody, setModalBody] = useState(null);

    const handleClose = () => {
        props.closeModal();
    }
    useEffect(() => {
        // Update modalData state with the new props.modalData
        setModalData(props.modalData);
    }, [props.modalData]); // Ensure the effect runs whenever props.modalData changes
    
    useEffect(() => {
        if (modalData && modalData['type'] === 'new-wish') {
            setModalTitle('Add a new wish');
            setModalBody(<ModalNewWish apiRoot={props.apiRoot} handleClose={handleClose} modalData={modalData} />);
        }else if (modalData && modalData['type'] === 'share-list') {
            setModalTitle('Share this Wishlist');
            setModalBody(
                <ModalShareList apiRoot={props.apiRoot} handleClose={handleClose} modalData={modalData}/>
            );
        }else if (modalData && modalData['type'] === 'new-list') {
            setModalTitle('Create a New Wishlist'); // Correctly call setModalTitle as a function
            setModalBody(
                <ModalNewList apiRoot={props.apiRoot} handleClose={handleClose} modalData={modalData}/>
            );
        }else if (modalData && modalData['type'] === 'edit-list') {
            setModalTitle('Edit Wishlist'); // Correctly call setModalTitle as a function
            setModalBody(
                <ModalEditList apiRoot={props.apiRoot} handleClose={handleClose} modalData={modalData}/>
            );
        }else if (modalData && modalData['type'] === 'new-person') {
            setModalTitle('Add a Person'); // Correctly call setModalTitle as a function
            setModalBody(
                <ModalNewPerson apiRoot={props.apiRoot} handleClose={handleClose} modalData={modalData}/>
            );
        }else if (modalData && modalData['type'] === 'view-item') {
            setModalTitle(modalData['item']['name']); // Correctly call setModalTitle as a function
            setModalBody(
                <ModalViewItem apiRoot={props.apiRoot} handleClose={handleClose} modalData={modalData}/>
            );
        }


        //after a tiny delay, add the --active class to the modal
        setTimeout(() => {
            document.querySelector('.modal-wrapper').classList.add('--active');
            document.querySelector('.modal-overlay').classList.add('--active');
        }, 10);

    }, [modalData]); // This effect depends on modalData
    

    return(
        <>
        <div className={`modal-overlay`} onClick={handleClose}></div>
        <div className={`modal-wrapper ${props.isPwaOnIOS ? '--pwa' : '--no-pwa'}`}>
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