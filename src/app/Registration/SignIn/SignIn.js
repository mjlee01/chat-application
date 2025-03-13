'use client';

import { useState } from 'react';
import Field from '@/components/Field';
import Checkbox from '@/components/Checkbox';
import { useUserStore } from '@/store/store';
import { useRouter } from 'next/navigation';

const SignIn = () => {
    //useState initialization

    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const setAuthUser = useUserStore((state) => state.setAuthUser);
    const router = useRouter();

    const handleChange = (e) => {
        // handleChange function
    };

    const toggleRememberMe = () => {
        //toggleRememberMe function
    };

    const login = async (event) => {
        event.preventDefault();

        if (!formData.email || !formData.password) {
            setError('Email and password are required');
            return;
        }

        try {
            setIsSubmitting(true);
            setError('');

            const response = await fetch('http://localhost:3000/api/SignIn', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const authUser = await response.json();

            if (authUser.error) {
                setError('Invalid email or password');
                return;
            }

            // Set authentication cookie
            const expires = formData.rememberMe ? '; max-age=2592000' : ''; // 30 days if remember me
            document.cookie = `auth=${authUser.token}; path=/${expires}`;

            // Update global state
            setAuthUser(authUser.record);

            // Redirect to Chat page
            router.push('/Chat');
        } catch (err) {
            setError('Authentication failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={login} className='w-full'>
            <div className='mb-1 text-h1'>Sign In</div>
            <p className='mb-12 text-sm text-gray-500'>Welcome back</p>

            {error && <p className='text-red-500 mb-4'>{error}</p>}

            {/* Email Field */}
            {/* Password Field */}

            <div className='flex justify-between items-center mb-6.5'>
                {/* Remember me checkbox */}
                <button
                    type='button'
                    className='text-xs font-bold hover:text-purple-600'
                    onClick={() => router.push('/recover-password')}
                >
                    Recover password
                </button>
            </div>

            <button
                className='btn-purple btn-shadow w-full h-14'
                type='submit'
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>
        </form>
    );
};

export default SignIn;
