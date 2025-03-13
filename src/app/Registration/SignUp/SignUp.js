'use client';

import { useState } from 'react';
import Field from '@/components/Field';
import Checkbox from '@/components/Checkbox';

const SignUp = ({ setIsSignUp }) => {
    //useState initialization
    
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        //handleChange function
    };


    const handleCheckboxChange = (field) => {
        //handleCheckboxChange function
    };

    const validateForm = () => {
        //validateForm function
    };

    const register = async (event) => {
        event.preventDefault();

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            setIsSubmitting(true);
            setError('');

            const response = await fetch('http://localhost:3000/api/SignUp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    name: formData.name,
                    password: formData.password,
                    passwordConfirm: formData.confirmPassword,
                }),
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Registration failed');
            }

            setIsSignUp(false);
            // Handle successful registration
        } catch (err) {
            setError(err.message || 'Something went wrong');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <div className='mb-1 text-h1'>Sign up</div>
            <div className='mb-12 text-sm text-n-2 dark:text-white/50'>
                Before we start, please enter your details
            </div>
            <form onSubmit={register}>
                {error && <p className='text-red-500 mb-4'>{error}</p>}

                {/* Email Field */}
                {/* Name Field */}
                {/* Password Field */}
                {/* Confirm Password Field */}
                {/* Agree Email Checkbox */}
                {/* Conditions Checkbox */}

                <button
                    className='btn-purple btn-shadow w-full h-14'
                    type='submit'
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Creating...' : 'Create account'}
                </button>
            </form>
        </div>
    );
};

export default SignUp;
