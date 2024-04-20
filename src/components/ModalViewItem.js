import React, { useState, useRef, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';


function ModalViewItem(props){
    const [isLoading, setIsLoading] = useState(false);

    return(
        <div className='modal-body'>
            <p>Item details</p>
        </div>
    );
}
export default ModalViewItem;