'use client';

import { useState } from 'react';
import Field from '@/components/Field';
import Checkbox from '@/components/Checkbox';
import { useUserStore } from '@/store/store';
import { useRouter } from 'next/navigation';

const SignIn = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false,
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const setAuthUser = useUserStore((state) => state.setAuthUser);
    const router = useRouter();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const toggleRememberMe = () => {
        setFormData((prev) => ({ ...prev, rememberMe: !prev.rememberMe }));
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

            <Field
                className='mb-4.5'
                label='Email'
                name='email'
                type='email'
                placeholder='Enter your email'
                icon='email'
                value={formData.email}
                onChange={handleChange}
            />

            <Field
                className='mb-4.5'
                label='Password'
                name='password'
                type='password'
                placeholder='Enter your password'
                icon='password'
                value={formData.password}
                onChange={handleChange}
            />

            <div className='flex justify-between items-center mb-6.5'>
                <Checkbox
                    label='Remember me'
                    value={formData.rememberMe}
                    onChange={toggleRememberMe}
                />
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
