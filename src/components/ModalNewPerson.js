import React, { useState, useRef, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';

function ModalNewPerson(props){
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const handleSuccess = (account_uid) => {
        document.getElementById('new-person-form').reset();
        props.handleClose();

        //navigate(`/people/data.account['${account_uid}']`);
        //navigate('/');
        //navigate to the new person's page
        navigate(`/people/${account_uid}`);

    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        //send the email to the server
        document.querySelectorAll('.form-group').forEach((formGroup) => {
            formGroup.classList.remove('--error');
        });

        //get the form data from the form with ID sign-up-form
        const formData = new FormData(document.getElementById('new-person-form'));
        console.log(formData);

        fetch(`${props.apiRoot}/wishlist_share?token=${localStorage.getItem('token')}`, {
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
                toast.success('Person added!');
                setIsLoading(false);
                handleSuccess(data.account['account_uid']);
            }

        })
        .catch((error) => {
            toast.error('There was an error communicating with the server.');
            setIsLoading(false);
        });
        

    }

    return(
        <form id='new-person-form' className='form' onSubmit={handleSubmit}>
            <div className='modal-body'>
                <div className='form-group' id='form-group-title'>
                    <label>Share Code</label>
                    <input className='input-text' type='text' id='share_code' name='share_code' pattern="[A-Z0-9]{6}" title="Please enter 6 characters, numbers and letters only" disabled={isLoading} onChange={(e) => e.target.value = e.target.value.toUpperCase()} max={6} />
                    <div className='error-text'></div>
                    <div className='helper-text'>
                        Enter the share code provided by the person you want to connect with.
                    </div>
                </div>
            </div>
            <div className='modal-footer'>
                <button className={`button --primary ${isLoading ? '--loading' : ''}`} type='submit'><span>Add Person</span><div className="loader"></div></button>
            </div>
        </form>
    );
}
export default ModalNewPerson;