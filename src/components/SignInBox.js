import React, { useState } from 'react';

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
            props.setEmail(email);
            //props.setBoxState('sign-in');
            setIsLoading(true);
            //wait 2 seconds then change the state
            setTimeout(() => {
                props.setBoxState('sign-in');
                setIsLoading(false);
            }, 2000);
        }

        //setIsLoading(true); // Set loading state to true
        // Here you would typically handle the form submission (e.g., API call)
        // After the submission is complete, you can set isLoading back to false
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

    return (
        <form className='form'>
            <div className='form-group'>
                <label>Email Address</label>
                <input className='input-text' type='email' placeholder='example@email.com' value={props.email} />
            </div>
            <div className='form-group'>
                <label>Password</label>
                <input className='input-text' type='password' />
            </div>
            <div className='form-group'>
                <button className='button --primary --fw' type='submit'><span>Sign In</span><div className="loader"></div></button>
            </div>
        </form>
    );
}

function SignInBox() {
    const [boxState, setBoxState] = useState('welcome');
    const [email, setEmail] = useState('');

    if(boxState === 'welcome') {
        return (
            <div className='box'>
                <div className='body'>
                    <h3>Sign in or Sign up</h3>
                    <p>Enter your email address below, if you don’t have an account yet we’ll get you set up!</p>
                </div>
                <FormWelcome setBoxState={setBoxState} setEmail={setEmail}/>
            </div>
        );
    }else if(boxState === 'sign-in') {
        return (
            <div className='box'>
                <div className='body'>
                    <h3>Welcome back!</h3>
                    <p>Enter your password below to sign in.</p>
                </div>
                <FormSignIn setBoxState={setBoxState} email={email} setEmail={setEmail}/>
            </div>
        );
    }
}

export default SignInBox;