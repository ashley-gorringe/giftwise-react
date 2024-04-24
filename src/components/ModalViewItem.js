import React, { useState, useRef, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

function ModalViewItem(props){
    const [isLoading, setIsLoading] = useState(false);

    return(
        <div className='modal-body'>
            <span className='item-price'>{props.modalData['item']['price']}</span>
            <div className='item-image' style={{ backgroundImage: `url(${props.modalData['item']['image']})` }}></div>
                {props.modalData['item']['url'] && (
                    <a href={props.modalData['item']['url']} target='_blank' class="button --primary --fw"><span>Go to Link</span><ArrowTopRightOnSquareIcon/></a>
                )}
                {props.modalData['item']['notes'] && (
            <p className='item-notes'>{props.modalData['item']['notes']}</p>
                )}
        </div>
    );
}
export default ModalViewItem;