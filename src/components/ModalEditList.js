import React, { useState, useRef, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';


function ModalEditList(props){
    const [isLoading, setIsLoading] = useState(false);

    const handleDelete = () => {
        setIsLoading(true);
        const toastId = toast.loading('Deleting Wishlist...');
        fetch(`${props.apiRoot}/wishlists/${props.modalData['wishlist']}?token=${localStorage.getItem('token')}`, {
            method: 'DELETE',
        }).then(response => response.json()).then(data => {
            if(data.error){
                toast.error(data.error);
                setIsLoading(false);
            }else{
                toast.success('Wishlist deleted!');
                toast.dismiss(toastId);
                setIsLoading(false);
                props.handleClose();
                props.modalData['handleChangeWishlist'](props.modalData['primaryWishlist']);
                props.modalData['setWishlists'](data.wishlists);
            }
        }).catch((error) => {
            toast.error('There was an error communicating with the server.');
            setIsLoading(false);
        });
    };

    return(
        <div className='modal-body'>
            <button className={`button ${isLoading ? '--loading' : ''}`} type='button' onClick={handleDelete}><span>Delete Wishlist</span><div className="loader"></div></button>
        </div>
    );
}
export default ModalEditList;