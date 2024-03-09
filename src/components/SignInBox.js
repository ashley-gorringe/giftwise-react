import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

function FormWelcome(props) {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent the default form submission

        //make sure the email is valid
        const email = document.getElementById('email').value;
        if(email === ''){
            alert('Please enter a valid email address');
            return;
        }else{
            setIsLoading(true);
            //send the email to the server
            fetch(`${props.apiRoot}/users-email-count/`+email, {
                method: 'GET',
            })
            .then(response => response.json()).then(data => {
                console.log(data);
                if(data < 1){
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
                <input className='input-text' id='email' type='email' placeholder='example@email.com' />
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

        //get the form data from the form with ID sign-up-form
        const formData = new FormData(document.getElementById('sign-up-form'));
        console.log(formData.get('email'));
        fetch(`${props.apiRoot}/user-sign-in/`, {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json()).then(data => {
            console.log(data);
            if(data.error){
                alert(data.error);
                setIsLoading(false);
            }else{
                //set local storage
                localStorage.setItem('token', data.token);

                //set the user in the app state
                props.setUser(data.user);

                //set the user as signed in
                props.setIsSignedIn(true);
            }
        })
        .catch((error) => {
            toast.error('There was an error communicating with the server.');
            setIsLoading(false);
        }
        );
    };

    return (
        <form className='form' id='sign-up-form' onSubmit={handleSubmit}>
            <div className='form-group'>
                <label>Email Address</label>
                <input className='input-text' type='email' name='email' placeholder='example@email.com' value={props.email} />
            </div>
            <div className='form-group'>
                <label>Password</label>
                <input className='input-text' type='password' name='password' />
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

    const handleBack = (e) => {
        e.preventDefault();
        props.setEmail('');
        props.setBoxState('welcome');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        //send the email to the server

        //get the form data from the form with ID sign-up-form
        const formData = new FormData(document.getElementById('sign-up-form'));
        console.log(formData.get('email'));
        fetch(`${props.apiRoot}/users/`, {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json()).then(data => {
            console.log(data);
            if(data.error){
                alert(data.error);
                setIsLoading(false);
            }else{
                //set local storage
                localStorage.setItem('token', data.token);

                //set the user in the app state
                props.setUser(data.user);

                //set the user as signed in
                props.setIsSignedIn(true);
            }
        })
        .catch((error) => {
            //alert('There was an error communicating with the server');
            toast.error('There was an error communicating with the server.');
            setIsLoading(false);
        }
        );
    };

    return (
        <form className='form' id='sign-up-form' onSubmit={handleSubmit}>
            <div className='form-group'>
                <label>Email Address</label>
                <input className='input-text' type='email' name='email' placeholder='example@email.com' value={props.email} />
            </div>
            <div className='form-group'>
                <label>Full Name</label>
                <input className='input-text' type='text' name='name_full' />
            </div>
            <div className='form-group'>
                <label>Preferred Name</label>
                <input className='input-text' type='text' name='name_preferred' />
            </div>
            <div className='form-group'>
                <label>Password</label>
                <input className='input-text' type='password' name='password' />
            </div>
            <div className='form-group'>
                <label>Re-enter Password</label>
                <input className='input-text' type='password' name='password_re' />
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