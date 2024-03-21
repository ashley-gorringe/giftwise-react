import React, { useState, useRef, useEffect } from 'react';
import { FileUploader } from "react-drag-drop-files";
import toast, { Toaster } from 'react-hot-toast';

import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';

function ModalNewList(props){
    const [isLoading, setIsLoading] = useState(false);
    const [file, setFile] = useState(null);
    const fileTypes = ["JPEG", "JPG", "PNG"];

    const [whoFor, setWhoFor] = useState('myself');

    const handleSuccess = (uid, is_private, wishlists) => {
        props.handleClose();
        props.modalData['handleChangeWishlist'](uid, is_private);
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

        //if account_name is empty, add an error class to the form group
        if(!formData.get('account_name')){
            document.querySelector('input[name="account_name"]').closest('.form-group').classList.add('--error');
            document.querySelector('input[name="account_name"]').closest('.form-group').querySelector('.error-text').innerText = 'Please enter a name for your Wishlist.';
            setIsLoading(false);
            return;
        }else{
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
                    handleSuccess(data.account_uid, data.is_private, data.wishlists);
                }
    
            })
            .catch((error) => {
                toast.error('There was an error communicating with the server.');
                setIsLoading(false);
            });
        }
        

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

    const handleSetWhoFor = (whoFor) => {
        return () => {
            setWhoFor(whoFor);
        };
    };

    return (
        <form id='new-list-form' className='form' encType="multipart/form-data" onSubmit={handleSubmit}>
            <div className='modal-body new-list-form'>
                <p>You can set up a new Wishlist for someone else, such as a young child or someone unable to use Giftwise on their own, or just for yourself to keep your wishes neatly organised.</p>
                <div className='form-group'>
                    <label>Who's this list for?</label>
                    <div className='radio-group'>
                        <button type='button' className={whoFor === 'myself' ? '--selected' : ''} onClick={handleSetWhoFor('myself')}>Myself</button>
                        <button type='button' className={whoFor === 'another' ? '--selected' : ''} onClick={handleSetWhoFor('another')}>Another Person</button>
                    </div>
                </div>
                <input type='hidden' name='who_for' value={whoFor} />
                {whoFor === 'another' && (
                    <>
                        <div className='form-group'>
                            <label>Full Name</label>
                            <input className='input-text' type='text' name='account_name' autoFocus disabled={isLoading} />
                            <div className='error-text'></div>
                            <div className='helper-text'>What's the name of the person that you're creating this Wishlist for? <br/><br/>This will be shown to other people when you connect with them on Giftwise.</div>
                        </div>
                        <div className='form-group' id='form-group-image'>
                            <label id='group-label'>Picture</label>
                            <FileUploadGroup />
                            <div className='error-text'></div>
                            <div className='helper-text'>Add a profile picture for the person. <br/><br/>This will be shown to other people when you connect with them on Giftwise.</div>
                        </div>
                    </>
                )}
                {whoFor === 'myself' && (
                    <>
                        <div className='form-group'>
                            <label>Wishlist Name</label>
                            <input className='input-text' type='text' name='account_name' autoFocus disabled={isLoading} />
                            <div className='error-text'></div>
                            <div className='helper-text'>What would you like to call your new Wishlist?</div>
                        </div>
                    </>
                )}
            </div>
            <div className='modal-footer'>
                <button className={`button --primary ${isLoading ? '--loading' : ''}`} type='submit'><span>Create Wishlist</span><div className="loader"></div></button>
            </div>
        </form>
    );
}
export default ModalNewList;