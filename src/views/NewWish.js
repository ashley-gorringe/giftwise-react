import React, { useState, useRef, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

import { ArrowUturnLeftIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';

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

        fetch(`${props.apiRoot}/items?type=manual&token=${localStorage.getItem('token')}`, {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json()).then(data => {
            
            if(data.error){
                toast.error(data.error);
                setIsLoading(false);
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
                <div className='form-group'>
                    <label>Choose a Wishlist</label>
                    <select className='input-select' id='wishlist' name='wishlist'>
                        <option value={props.user.primary_account}>My Wishlist</option>
                    </select>
                    <div className='error-text'></div>
                    <div className='helper-text'>Which wishlist would you like to add the item to?</div>
                </div>
            );
        }else if(props.user.accounts.length > 0){
            return(
                <div className='form-group'>
                    <label>Choose a Wishlist</label>
                    <select className='input-select' id='wishlist' name='wishlist'>
                        <option value={props.user.primary_account}>My Wishlist</option>
                        {props.user.accounts.map((account) => {
                            return <option key={account.account_uid} value={account.account_uid}>{account.name_full}</option>
                        })}
                    </select>
                    <div className='error-text'></div>
                    <div className='helper-text'>What's the name of the product or thing?</div>
                </div>
            );
        }
    };

    return(
        <div className='new-wish-manual-form'>
            <form id='manual-form' className='form' onSubmit={handleSubmit}>
                <div className='row'>
                    <div className='column'>
                        <AccountSelector user={props.user} />
                        <div className='form-group'>
                            <label>Wish Title</label>
                            <input className='input-text' type='text' id='title' name='title' defaultValue={props.product?.title} />
                            <div className='error-text'></div>
                            <div className='helper-text'>What's the name of the product or thing?</div>
                        </div>
                        <div className='form-group'>
                            <label>Desciption</label>
                            <textarea className='input-textarea' rows={5} id='description' name='description' defaultValue={props.product?.description}></textarea>
                            <div className='error-text'></div>
                            <div className='helper-text'>Any extra notes?</div>
                        </div>
                        <div className='form-group'>
                            <label>Product Link</label>
                            <input className='input-text' type='text' id='url' name='url' placeholder='https://example.com' defaultValue={props.product?.url} />
                            <div className='error-text'></div>
                        </div>
                    </div>
                    <div className='column'>
                        <div className='image-upload'>
                            <ArrowUpTrayIcon/>
                            <span>Upload Image</span>
                        </div>
                        <div className='form-group'>
                            <button className={`button --primary --fw ${isLoading ? '--loading' : ''}`} type='submit'><span>Add Wish</span><div className="loader"></div></button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

function NewWish(props){
    const [formStage, setFormStage] = useState('link');
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