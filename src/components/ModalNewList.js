import React, { useState, useRef, useEffect } from 'react';
import { FileUploader } from "react-drag-drop-files";
import toast, { Toaster } from 'react-hot-toast';

import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';

function ModalNewList(props){
    const [isLoading, setIsLoading] = useState(false);
    const [file, setFile] = useState(null);
    const fileTypes = ["JPEG", "JPG", "PNG"];

    const handleSuccess = (uid, wishlists) => {
        props.handleClose();
        props.modalData['handleChangeWishlist'](uid);
        props.modalData['setWishlists'](wishlists);
        //reset the form
        document.getElementById('new-list-form').reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        //send the email to the server
        document.querySelectorAll('.form-group').forEach((formGroup) => {
            formGroup.classList.remove('--error');
        });

        //get the form data from the form with ID sign-up-form
        const formData = new FormData(document.getElementById('new-list-form'));
        console.log(formData);
        //set the image field to use the file object
        formData.set('image', file);
        console.log(formData.get('image'));

        fetch(`${props.apiRoot}/wishlists?token=${localStorage.getItem('token')}`, {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json()).then(data => {
            
            if(data.error){
                toast.error(data.error);
                setIsLoading(false);
                for(let error_field in data.error_fields){
                    document.querySelector(`input[name="${error_field}"]`).closest('.form-group').classList.add('--error');
                    document.querySelector(`input[name="${error_field}"]`).closest('.form-group').querySelector('.error-text').innerText = data.error_fields[error_field];
                }
            }else{
                toast.success('Wishlist created!');
                setIsLoading(false);
                handleSuccess(data.account_uid, data.wishlists);
            }

        })
        .catch((error) => {
            toast.error('There was an error communicating with the server.');
            setIsLoading(false);
        });
        

    }

    function FileUploadGroup(){
        const handleChange = (file) => {
            setFile(file);
            console.log(file);
        };
        const FileUploaderClasses = file ? 'image-upload --has-image' : 'image-upload';
        function FileUploaderChildren(){
            if(file){
                return (
                    <>
                    <div className='image-preview' style={{ backgroundImage: `url(${URL.createObjectURL(file)})` }}></div>
                    </>
                );
            }else{
                return (
                    <>
                    <ArrowUpTrayIcon/>
                    <span>Click here or drag in an image</span>
                    </>
                );
            }
        }
        return(
            <FileUploader
                multiple={false}
                handleChange={handleChange}
                name="image"
                types={fileTypes}
                classes={FileUploaderClasses}
                children={<FileUploaderChildren/>}
                hoverTitle="Drop your image here"
                dropMessageStyle={{display: 'none'}}
                disabled={isLoading}
            />
        );
    };

    return(
        <form id='new-list-form' className='form' encType="multipart/form-data" onSubmit={handleSubmit}>
            <div className='modal-body new-list-form'>
                <div className='form-group'>
                    <label>Full Name</label>
                    <input className='input-text' type='text' name='name_full' autoFocus disabled={isLoading} />
                    <div className='error-text'></div>
                    <div className='helper-text'>This will be shown to other people when you connect with them on Giftwise.</div>
                </div>
                <div className='form-group' id='form-group-image'>
                    <label id='group-label'>Picture</label>
                    <FileUploadGroup />
                    <div className='error-text'></div>
                    <div className='helper-text'>This will be shown to other people when you connect with them on Giftwise.</div>
                </div>
            </div>
            <div className='modal-footer'>
                <button className={`button --primary ${isLoading ? '--loading' : ''}`} type='submit'><span>Create Wishlist</span><div className="loader"></div></button>
            </div>
        </form>
    );
}
export default ModalNewList;