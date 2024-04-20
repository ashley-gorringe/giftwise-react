import React, { useState, useRef, useEffect } from 'react';
import { FileUploader } from "react-drag-drop-files";
import CurrencyInput from 'react-currency-input-field';
import toast, { Toaster } from 'react-hot-toast';

import { ArrowUturnLeftIcon, ArrowUpTrayIcon, TrashIcon } from '@heroicons/react/24/outline';

function ManualForm(props){
    const [isLoading, setIsLoading] = useState(false);
    const [file, setFile] = useState(null);
    const fileTypes = ["JPEG", "JPG", "PNG"];

    const handleSuccess = (e) => {
        document.getElementById('new-wish-form').reset();
        props.handleClose();
        props.modalData['getItems']();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        //send the email to the server
        document.querySelectorAll('.form-group').forEach((formGroup) => {
            formGroup.classList.remove('--error');
        });

        //get the form data from the form with ID sign-up-form
        const formData = new FormData(document.getElementById('new-wish-form'));
        console.log(formData);
        //set the image field to use the file object
        formData.set('image', file);
        console.log(formData.get('image'));
        console.log(formData.get('linked-image'));

        fetch(`${props.apiRoot}/items?type=manual&token=${localStorage.getItem('token')}`, {
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
                toast.success('Wish added!');
                setIsLoading(false);
                handleSuccess();
            }

        })
        .catch((error) => {
            toast.error('There was an error communicating with the server.');
            setIsLoading(false);
        });
        

    }

    function FileUploadGroup(props) {
        const [linkedImage, setLinkedImage] = useState(null);
    
        useEffect(() => {
            // This effect runs only when props.product['image'] changes
            if(props.product) {
                setLinkedImage(props.product['image_url']);
            }
        }, [props.product]); // Dependency array to only re-run if props.product changes
    
        const handleChange = (file) => {
            setFile(file); // This should likely set the file state
            console.log(file);
            setLinkedImage(null);
        };
    
        const FileUploaderClasses = file ? 'image-upload --has-image' : 'image-upload';
    
        function FileUploaderChildren() {
            if(file) {
                return (
                    <>
                        <div className='image-preview' style={{ backgroundImage: `url(${URL.createObjectURL(file)})` }}></div>
                    </>
                );
            } else {
                return (
                    <>
                        <ArrowUpTrayIcon/>
                        <span>Click here or drag in an image</span>
                    </>
                );
            }
        }
    
        if(linkedImage !== null) {
            return (
                <>
                <div className='image-upload --has-image'>
                    <div className='image-preview --linked' style={{ backgroundImage: `url(${linkedImage})` }}></div>
                    <button className='bin-button' onClick={() => setLinkedImage(null)}><TrashIcon/></button>
                </div>
                <input type='hidden' name='linked-image' value={linkedImage} />
                </>
            );
        } else {
            return (
                <FileUploader
                    multiple={false}
                    handleChange={handleChange}
                    name="image"
                    types={fileTypes} // Ensure fileTypes is defined elsewhere in your code
                    classes={FileUploaderClasses}
                    children={<FileUploaderChildren/>}
                    hoverTitle="Drop your image here"
                    dropMessageStyle={{display: 'none'}}
                    disabled={isLoading} // Ensure isLoading is defined elsewhere in your code
                />
            );
        }
    };

    return(
        <form id='new-wish-form' className='form' encType="multipart/form-data" onSubmit={handleSubmit}>
            <div className='modal-body new-wish-manual-form'>
                <input type='hidden' name='wishlist' value={props.modalData['wishlist']} />
                <div className='form-group' id='form-group-title'>
                    <label>Wish Title</label>
                    <input className='input-text' type='text' id='title' name='title' defaultValue={props.product?.title} disabled={isLoading}/>
                    <div className='error-text'></div>
                </div>
                <div className='form-group' id='form-group-url'>
                    <label>Product Link</label>
                    <input className='input-text' type='text' id='url' name='url' placeholder='https://example.com' defaultValue={props.product?.link} disabled={isLoading} />
                    <div className='error-text'></div>
                </div>
                <div className='form-group' id='form-group-price'>
                    <label>Price</label>
                    <div className='input-price'>
                        <select className='currency-select' id='currency' name='currency' defaultValue={'gbp'} disabled={isLoading}>
                            <option value="gbp">£ (GBP)</option>
                        </select>
                        <CurrencyInput
                        id="value"
                        name="value"
                        placeholder="0.00"
                        defaultValue={props.product?.price}
                        decimalsLimit={2}
                        onValueChange={(value, name, values) => console.log(value, name, values)}
                        disabled={isLoading}
                        />
                    </div>
                    <div className='error-text'></div>
                </div>
                <div className='form-group' id='form-group-description'>
                    <label>Additional Notes</label>
                    <textarea className='input-textarea' rows={6} id='description' name='description' disabled={isLoading}></textarea>
                    <div className='error-text'></div>
                    <div className='helper-text'>Do you need to add any specific details to this wish?</div>
                </div>
                
                <div className='form-group' id='form-group-image'>
                    <label>Image</label>
                    <FileUploadGroup product={props.product}/>
                    <div className='error-text'></div>
                </div>
            </div>
            <div className='modal-footer'>
                <button className={`button --primary ${isLoading ? '--loading' : ''}`} type='submit'><span>Add Wish</span><div className="loader"></div></button>
            </div>
        </form>
    );
}

function LinkForm(props){
    const [isLoading, setIsLoading] = useState(false);

    const handleSuccess = (e) => {
        document.getElementById('new-wish-form').reset();
        props.setProcess('manual');
    };

    const handleManual = (e) => {
        e.preventDefault();
        props.setProcess('manual');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        //send the email to the server
        document.querySelectorAll('.form-group').forEach((formGroup) => {
            formGroup.classList.remove('--error');
        });

        //get the form data from the form with ID sign-up-form
        const formData = new FormData(document.getElementById('new-wish-form'));
        console.log(formData);
        //set the image field to use the file object

        fetch(`${props.apiRoot}/items?type=link&token=${localStorage.getItem('token')}`, {
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
                setIsLoading(false);
                props.setProduct(data.product);
                handleSuccess();
            }

        })
        .catch((error) => {
            toast.error('There was an error communicating with the server.');
            setIsLoading(false);
        });
        

    }


    return(
        <form id='new-wish-form' className='form' encType="multipart/form-data" onSubmit={handleSubmit}>
            <div className='modal-body'>
                <p>Enter a link to the item, we'll try to get it's details.</p>
                <div className='form-group' id='form-group-url'>
                    <label>Product Link</label>
                    <input className='input-text' type='text' id='url' name='url' placeholder='https://example.com' defaultValue={props.product?.url} disabled={isLoading} />
                    <div className='error-text'></div>
                </div>
            </div>
            <div className='modal-footer'>
                <button className={`button --primary ${isLoading ? '--loading' : ''}`} type='submit'><span>Add Wish</span><div className="loader"></div></button>
                <button onClick={handleManual} className={`button ${isLoading ? '--loading' : ''}`} type='button' ><span>Enter Manually</span></button>
            </div>
        </form>
    );
}

function ModalNewWish(props){
    const [process, setProcess] = useState('link');
    const [product, setProduct] = useState(null);
    if(process === 'manual'){
        return(
            <ManualForm apiRoot={props.apiRoot} modalData={props.modalData} handleClose={props.handleClose} product={product}/>
        );
    }else if(process === 'link'){
        return(
            <LinkForm apiRoot={props.apiRoot} modalData={props.modalData} setProcess={setProcess} setProduct={setProduct}/>
        );
    }
}
export default ModalNewWish;