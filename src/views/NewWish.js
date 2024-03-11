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
        console.log(formData.get('email'));

        if(formData.get('link') === ''){
            document.getElementById('link').closest('.form-group').classList.add('--error');
            document.getElementById('link').nextElementSibling.textContent = 'Please enter a link to the item.';
            setIsLoading(false);
        }else{
            const toastID = toast.loading('Getting product details...');
            fetch(`${props.apiRoot}/items?type=link`, {
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
    return(
        <div className='new-wish-manual-form'>
            <form id='manual-form' className='form'>
                <div className='row'>
                    <div className='column'>
                        <div className='form-group'>
                            <label>Wish Title</label>
                            <input className='input-text' type='text' id='title' name='title' defaultValue={props.product?.title} />
                            <div className='error-text'></div>
                            <div className='helper-text'>What's the name of the product or thing?</div>
                        </div>
                        <div className='form-group'>
                            <label>Desciption</label>
                            <textarea className='input-textarea' rows={5} id='desciption' name='desciption'>{props.product?.description}</textarea>
                            <div className='error-text'></div>
                            <div className='helper-text'>Any extra notes?</div>
                        </div>
                        <div className='form-group'>
                            <label>Product Link</label>
                            <input className='input-text' type='text' id='link' name='link' placeholder='https://example.com' defaultValue={props.product?.url} />
                            <div className='error-text'></div>
                            <div className='helper-text'>We'll try to fetch the product details for you</div>
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
        {formStage === 'link' ? <FormLink apiRoot={props.apiRoot} setFormStage={setFormStage} setProduct={setProduct} /> : <FormManual apiRoot={props.apiRoot} product={product} />}
        </>
    );
}

export default NewWish;