import React, { useState, useRef, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { FileUploader } from "react-drag-drop-files";
import CurrencyInput from 'react-currency-input-field';

import { ArrowUturnLeftIcon, ArrowUpTrayIcon, TrashIcon } from '@heroicons/react/24/outline';

function FormLink(props) {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        //send the email to the server
        document.querySelectorAll('.form-group').forEach((formGroup) => {
            formGroup.classList.remove('--error');
        });

        //get the form data from the form with ID sign-up-form
        const formData = new FormData(document.getElementById('link-form'));

        if(formData.get('link') === ''){
            document.getElementById('link').closest('.form-group').classList.add('--error');
            document.getElementById('link').nextElementSibling.textContent = 'Please enter a link to the item.';
            setIsLoading(false);
        }else{
            const toastID = toast.loading('Getting product details...');
            fetch(`${props.apiRoot}/items?type=link&token=${localStorage.getItem('token')}`, {
                method: 'POST',
                body: formData,
            })
            .then(response => response.json()).then(data => {
                if(data.product){
                    toast.success('Found the product!', {id: toastID});
                    setIsLoading(false);
                    props.setProduct(data.product);
                    props.setFormStage('manual');
                }else{
                    toast('We couldn\'t find the product. Please add the item manually.', {id: toastID});
                    setIsLoading(false);
                    props.setFormStage('manual');
                }
            })
            .catch((error) => {
                toast.error('There was an error communicating with the server.');
                setIsLoading(false);
                toast.remove(toastID);
            }
            );
        }
        

    }

    const handleManual = (e) => {
        e.preventDefault();
        props.setFormStage('manual');
    };

    return(
        <div className='new-wish-link-form'>
            <form id='link-form' className='form' onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor='name'>Product Link</label>
                    <input className='input-text' type='text' id='link' name='link' placeholder='https://example.com' autoFocus />
                    <div className='error-text'></div>
                    <div className='helper-text'>We'll try to fetch the product details for you</div>
                </div>
                <div className='form-group'>
                    <button className={`button --primary --fw ${isLoading ? '--loading' : ''}`} type='submit'><span>Add Wish</span><div className="loader"></div></button>
                    
                    <button className='button --secondary' type='button' onClick={handleManual}><span>Or add Item manually</span></button>
                </div>
            </form>
        </div>
    );
}

function FormManual(props) {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const fileTypes = ["JPEG", "JPG", "PNG"];

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        //send the email to the server
        document.querySelectorAll('.form-group').forEach((formGroup) => {
            formGroup.classList.remove('--error');
        });

        //get the form data from the form with ID sign-up-form
        const formData = new FormData(document.getElementById('manual-form'));
        console.log(formData);
        //set the image field to use the file object
        formData.set('image', file);
        console.log(formData.get('image'));

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
                navigate('/');
            }

        })
        .catch((error) => {
            toast.error('There was an error communicating with the server.');
            setIsLoading(false);
        });
        

    }

    function AccountSelector(props){

        if(props.user.accounts.length === 0){
            return(
                <div className='account-selector'>
                    <div className='form-group' id='form-group-wishlist'>
                        <label>Choose a Wishlist</label>
                        <select className='input-select' id='wishlist' name='wishlist' disabled={isLoading}>
                            <option value={props.user.primary_account}>My Wishlist</option>
                        </select>
                        <div className='error-text'></div>
                    </div>
                    <div className='form-group' id='form-group-privacy'>
                        <label>Who can see this?</label>
                        <select className='input-select' id='privacy' name='privacy' defaultValue={'1'} disabled>
                            <option value="1">Friends & Family</option>
                        </select>
                        <div className='error-text'></div>
                    </div>
                </div>
            );
        }else if(props.user.accounts.length > 0){
            return(
                <div className='account-selector'>
                    <div className='form-group' id='form-group-wishlist'>
                        <label>Choose a Wishlist</label>
                        <select className='input-select' id='wishlist' name='wishlist' disabled={isLoading}>
                            <option value={props.user.primary_account}>My Wishlist</option>
                            {props.user.accounts.map((account) => {
                                return <option key={account.account_uid} value={account.account_uid}>{account.name_full}</option>
                            })}
                        </select>
                        <div className='error-text'></div>
                    </div>
                    <div className='form-group' id='form-group-privacy'>
                        <label>Who can see this?</label>
                        <select className='input-select' id='privacy' name='privacy' defaultValue={'1'} disabled>
                            <option value="1">Friends & Family</option>
                        </select>
                        <div className='error-text'></div>
                    </div>
                </div>
            );
        }
    };
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
        <div className='new-wish-manual-form'>
            <form id='manual-form' className='form' onSubmit={handleSubmit} encType="multipart/form-data">
                <div className='new-wish-manual-form-grid'>
                        <AccountSelector user={props.user} />
                        <div className='form-group' id='form-group-title'>
                            <label>Wish Title</label>
                            <input className='input-text' type='text' id='title' name='title' defaultValue={props.product?.title} disabled={isLoading}/>
                            <div className='error-text'></div>
                        </div>
                        <div className='form-group' id='form-group-url'>
                            <label>Product Link</label>
                            <input className='input-text' type='text' id='url' name='url' placeholder='https://example.com' defaultValue={props.product?.url} disabled={isLoading} />
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
                                defaultValue={null}
                                decimalsLimit={2}
                                onValueChange={(value, name, values) => console.log(value, name, values)}
                                disabled={isLoading}
                                />
                            </div>
                            <div className='error-text'></div>
                        </div>
                        <div className='form-group' id='form-group-description'>
                            <label>Additional Notes</label>
                            <textarea className='input-textarea' rows={6} id='description' name='description' defaultValue={props.product?.description} disabled={isLoading}></textarea>
                            <div className='error-text'></div>
                            <div className='helper-text'>Do you need to add any specific details to this wish?</div>
                        </div>
                        
                        <div className='form-group' id='form-group-image'>
                            <label>Image</label>
                            <FileUploadGroup />
                            <div className='error-text'></div>
                        </div>
                        
                        <div className='form-group' id='form-group-submit'>
                            <button className={`button --primary --fw ${isLoading ? '--loading' : ''}`} type='submit'><span>Add Wish</span><div className="loader"></div></button>
                        </div>
                </div>
            </form>
        </div>
    );
}

function NewWish(props){
    const [formStage, setFormStage] = useState('manual');
    const [product, setProduct] = useState(null);

    return(
        <>
        <div className='new-wish-header'>
            <div className='back-button-wrapper'>
                <Link to="/" className='back-button'><ArrowUturnLeftIcon/><span>Back</span></Link>
            </div>
            <h1>Add a New Wish</h1>
        </div>
        {formStage === 'link' ? <FormLink apiRoot={props.apiRoot} setFormStage={setFormStage} setProduct={setProduct} /> : <FormManual apiRoot={props.apiRoot} product={product} user={props.user} />}
        </>
    );
}

export default NewWish;