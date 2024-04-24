import React, { useState, useRef, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';


function ModalViewItem(props){
    const [isLoading, setIsLoading] = useState(false);

    return(
        <div className='modal-body'>
            <span className='item-price'>{props.modalData['item']['price']}</span>
            <div className='item-image' style={{ backgroundImage: `url(${props.modalData['item']['image']})` }}></div>
            <p className='item-notes'>{props.modalData['item']['notes']}</p>
        </div>
    );
}
export default ModalViewItem;