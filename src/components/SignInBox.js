import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import { FileUploader } from "react-drag-drop-files";
import { ArrowUpTrayIcon, TrashIcon } from '@heroicons/react/24/outline';

function FormWelcome(props) {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent the default form submission
        document.querySelectorAll('.form-group').forEach((formGroup) => {
            formGroup.classList.remove('--error');
        });

        //make sure the email is valid
        const email = document.getElementById('email').value;
        if(email === ''){
            //find the nearest .field-group and add the class .error
            document.getElementById('email').closest('.form-group').classList.add('--error');
            document.getElementById('email').closest('.form-group').querySelector('.error-text').innerText = 'Please enter your email address';
            return;
        }else{
            setIsLoading(true);
            //send the email to the server
            fetch(`${props.apiRoot}/users?email=`+email, {
                method: 'GET',
            })
            .then(response => response.json()).then(data => {
                if(data.user_count < 1){
                    setTimeout(() => {
                        props.setEmail(email);
                        props.setBoxState('sign-up');
                        setIsLoading(false);
                    }, 200);
                }else{
                    setTimeout(() => {
                        props.setEmail(email);
                        props.setBoxState('sign-in');
                        setIsLoading(false);
                    }, 200);
                }
            })
            .catch((error) => {
                toast.error('There was an error communicating with the server.');
                setIsLoading(false);
            }
            );

            /* props.setEmail(email);
            //props.setBoxState('sign-in');
            setIsLoading(true);
            //wait 2 seconds then change the state
            setTimeout(() => {
                props.setBoxState('sign-in');
                setIsLoading(false);
            }, 1000); */
        }
    };

    return (
        <form className='form' onSubmit={handleSubmit}>
            <div className='form-group'>
                <label>Email Address</label>
                <input className='input-text' id='email' type='email' placeholder='example@email.com' autoFocus disabled={isLoading}/>
                <div className='error-text'></div>
            </div>
            <div className='form-group'>
                <button className={`button --primary --fw ${isLoading ? '--loading' : ''}`} type='submit'><span>Continue</span><div className="loader"></div></button>
            </div>
        </form>
    );
}

function FormSignIn(props) {
    const [isLoading, setIsLoading] = useState(false);

    const handleBack = (e) => {
        e.preventDefault();
        props.setEmail('');
        props.setBoxState('welcome');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        //send the email to the server
        document.querySelectorAll('.form-group').forEach((formGroup) => {
            formGroup.classList.remove('--error');
        });

        //get the form data from the form with ID sign-up-form
        const formData = new FormData(document.getElementById('sign-in-form'));
        console.log(formData.get('email'));
        fetch(`${props.apiRoot}/login_tokens/`, {
            method: 'POST',
            body: formData,
        }).then(response => response.json()).then(data => {
            console.log(data);
            if(data.error){
                toast.error(data.error);
                setIsLoading(false);

                for(let error_field in data.error_fields){
                    document.querySelector(`input[name="${error_field}"]`).closest('.form-group').classList.add('--error');
                    document.querySelector(`input[name="${error_field}"]`).closest('.form-group').querySelector('.error-text').innerText = data.error_fields[error_field];
                }
            }else{
                //set local storage
                localStorage.setItem('token', data.token);

                //set the user in the app state
                props.setUser(data.user);

                //set the user as signed in
                props.setIsSignedIn(true);
            }
        }).catch((error) => {
            toast.error('There was an error communicating with the server.');
            console.error(error);
            setIsLoading(false);
        });
    };

    return (
        <form className='form' id='sign-in-form' onSubmit={handleSubmit}>
            <div className='form-group'>
                <label>Email Address</label>
                <input className='input-text' type='email' name='email' placeholder='example@email.com' defaultValue={props.email} disabled={isLoading} />
                <div className='error-text'></div>
            </div>
            <div className='form-group'>
                <label>Password</label>
                <input className='input-text' type='password' name='password' autoFocus disabled={isLoading} />
                <div className='error-text'></div>
            </div>
            <div className='form-group'>
                <button className={`button --primary --fw ${isLoading ? '--loading' : ''}`} type='submit'><span>Sign In</span><div className="loader"></div></button>
                <button className='button --fw' type='button' ><span>Forgot Password</span><div className="loader"></div></button>
                <button className='button --quiet --fw' type='button' onClick={handleBack}><span>Go Back</span><div className="loader"></div></button>
            </div>
        </form>
    );
}

function FormSignUp(props) {
    const [isLoading, setIsLoading] = useState(false);
    const [file, setFile] = useState(null);
    const fileTypes = ["JPEG", "JPG", "PNG"];

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

    const handleBack = (e) => {
        e.preventDefault();
        props.setEmail('');
        props.setBoxState('welcome');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        //send the email to the server
        //remove the --error class from all .form-group elements
        document.querySelectorAll('.form-group').forEach((formGroup) => {
            formGroup.classList.remove('--error');
        });

        //get the form data from the form with ID sign-up-form
        const formData = new FormData(document.getElementById('sign-up-form'));
        formData.set('image', file);
        fetch(`${props.apiRoot}/users/`, {
            method: 'POST',
            body: formData,
        }).then(response => response.json()).then(data => {
            console.log(data);
            if(data.error){
                toast.error(data.error);
                setIsLoading(false);

                for(let error_field in data.error_fields){
                    document.querySelector(`input[name="${error_field}"]`).closest('.form-group').classList.add('--error');
                    document.querySelector(`input[name="${error_field}"]`).closest('.form-group').querySelector('.error-text').innerText = data.error_fields[error_field];
                }
            }else{
                //set local storage
                localStorage.setItem('token', data.token);

                //set the user in the app state
                props.setUser(data.user);

                //set the user as signed in
                props.setIsSignedIn(true);
            }
        }).catch((error) => {
            toast.error('There was an error communicating with the server.');
            console.error(error);
            setIsLoading(false);
        });
    };

    return (
        <form className='form' id='sign-up-form' onSubmit={handleSubmit}>
            <div className='form-group' id='form-group-image'>
                <label id='group-label'>Picture</label>
                <FileUploadGroup />
                <div className='error-text'></div>
                <div className='helper-text'>This will be shown to other people when you connect with them on Giftwise.</div>
            </div>
            <div className='form-group'>
                <label>Email Address</label>
                <input className='input-text' type='email' name='email' placeholder='example@email.com' defaultValue={props.email} disabled={isLoading} />
                <div className='error-text'></div>
            </div>
            <div className='form-group'>
                <label>Full Name</label>
                <input className='input-text' type='text' name='name_full' autoFocus disabled={isLoading} />
                <div className='error-text'></div>
                <div className='helper-text'>This will be shown to other people when you connect with them on Giftwise.</div>
            </div>
            <div className='form-group'>
                <label>Preferred Name</label>
                <input className='input-text' type='text' name='name_preferred' disabled={isLoading} />
                <div className='error-text'></div>
                <div className='helper-text'>What would you like us to call you? Only you will see this.</div>
            </div>
            <div className='form-group'>
                <label>Password</label>
                <input className='input-text' type='password' name='password' disabled={isLoading} />
                <div className='error-text'></div>
            </div>
            <div className='form-group'>
                <label>Re-enter Password</label>
                <input className='input-text' type='password' name='password_re' disabled={isLoading} />
                <div className='error-text'></div>
            </div>
            <div className='form-group'>
                <button className={`button --primary --fw ${isLoading ? '--loading' : ''}`} type='submit'><span>Sign Up</span><div className="loader"></div></button>
                <button className='button --quiet --fw' type='button' onClick={handleBack}><span>Go Back</span><div className="loader"></div></button>
            </div>
        </form>
    );
}

function SignInBox(props) {
    const [boxState, setBoxState] = useState('welcome');
    const [email, setEmail] = useState('');

    if(boxState === 'welcome') {
        return (
            <div className='box'>
                <div className='body'>
                    <h3>Sign in or Sign up</h3>
                    <p>Enter your email address below, if you don’t have an account yet we’ll get you set up!</p>
                </div>
                <FormWelcome apiRoot={props.apiRoot} setBoxState={setBoxState} email={email} setEmail={setEmail}/>
            </div>
        );
    }else if(boxState === 'sign-in') {
        return (
            <div className='box'>
                <div className='body'>
                    <h3>Welcome back!</h3>
                    <p>Enter your password below to sign in.</p>
                </div>
                <FormSignIn apiRoot={props.apiRoot} setBoxState={setBoxState} email={email} setEmail={setEmail} setIsSignedIn={props.setIsSignedIn} setUser={props.setUser}/>
            </div>
        );
    }else if(boxState === 'sign-up') {
        return (
            <div className='box'>
                <div className='body'>
                    <h3>Get Signed Up!</h3>
                    <p>Enter your details below to get signed up!</p>
                </div>
                <FormSignUp apiRoot={props.apiRoot} setBoxState={setBoxState} email={email} setEmail={setEmail} setIsSignedIn={props.setIsSignedIn} setUser={props.setUser}/>
            </div>
        );
    }
}

export default SignInBox;