'use client';
import { useState } from 'react';
import Image from '@/components/Image';
import SignIn from './Registration/SignIn/SignIn';
import SignUp from './Registration/SignUp/SignUp';
import './globals.css';

const RegistrationPage = () => {
    const [isSignUp, setIsSignUp] = useState(false);

    return (
        <>
            <div className='relative overflow-hidden'>
                <div className='relative z-3 flex flex-col max-w-[75rem] min-h-screen mx-auto px-7.5 py-12 xls:px-20 lg:px-8 md:px-6 md:py-8'>
                    <div className='flex flex-col grow max-w-[27.31rem] lg:max-w-[25rem]'>
                        {isSignUp ? <SignUp setIsSignUp={setIsSignUp} /> : <SignIn />}
                        <p className='text-sm mt-4'>
                            {isSignUp
                                ? 'Already registered?'
                                : 'Don’t have an account?'}
                            <button
                                className='ml-1.5 font-bold transition-colors hover:text-purple-1'
                                onClick={() => setIsSignUp(!isSignUp)}
                            >
                                {isSignUp ? 'Sign in' : 'Create an account'}
                            </button>
                        </p>
                    </div>
                </div>

                {/* Background Image */}
                <div className='absolute -z-1 inset-0 overflow-hidden pointer-events-none'>
                    <div className='absolute top-[50%] left-[45vw] -translate-y-1/2 w-[85rem] xl:w-[60rem] md:w-[30rem]'>
                        <Image
                            src='/images/bg.svg'
                            width={1349}
                            height={1216}
                            alt=''
                        />
                    </div>
                </div>

                {/* Side Image */}
                <div className='absolute top-1/2 right-[calc(50%-61.8125rem)] w-[61.8125rem] -translate-y-1/2 xls:right-[calc(50%-61rem)] xls:w-[55rem] lg:right-[calc(50%-64rem)] md:hidden'>
                    <Image
                        className='w-auto h-auto mix-blend-overlay'
                        src='/images/sign in.webp'
                        width={989}
                        height={862}
                        alt=''
                    />
                </div>
            </div>
        </>
    );
};

export default RegistrationPage;
