'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/store';
import { pb } from '../lib/pocketbase';
import Icon from '@/components/Icon';
import Image from '@/components/Image';
import Comment from '@/components/Comment';

const ChatPage = ({ back, title }) => {
    const router = useRouter();
    const userStore = useUserStore((state) => state.authUser);
    const [value, setValue] = useState('');
    const [posts, setPosts] = useState([]);
    const isSubscribed = useRef(false);

    const teammembers = [
        '/images/avatars/avatar-1.jpg',
        '/images/avatars/avatar-2.png',
        '/images/avatars/avatar-3.png',
        '/images/avatars/avatar-4.png',
    ];

    const images = [
        '/images/shared_moments-1.jpeg',
        '/images/shared_moments-2.jpeg',
        '/images/shared_moments-3.jpeg',
        '/images/shared_moments-3.jpeg',
    ];

    const skills = [
        'Interface Design',
        'Business',
        'User Experience',
        'Marketing',
        'Development',
        'Founder',
    ];

    const fetchPosts = async () => {
        const response = await fetch('http://localhost:3000/api/posts');
        const data = await response.json();
        setPosts(data.items);
    };

    const submitPost = async () => {
        const response = await fetch('http://localhost:3000/api/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: value,
                likes: 0,
                user: userStore.id,
            }),
        });
        setValue('');
    };

    useEffect(() => {
        fetchPosts();
    }, []);
    
    useEffect(() => {
        //Subscribe to real time messages
        if (isSubscribed.current) return; // Prevent duplicate subscriptions
        const unsubscribe = pb.collection('messages').subscribe(
            '*',
            ({ record, action }) => {
                if (action === 'create') setPosts((prev) => [record, ...prev]);
            },
            {
                expand: 'user',
                sort: '-created',
            }
        );

        return () => {
            unsubscribe.then((unsub) => unsub()); // Cleanup subscription on unmount
            isSubscribed.current = false;
        };
    }, []);

    return (
        <div className='w-full h-screen flex p-6 mt-16'>
            <div className='flex flex-col h-full flex-grow'>
                {/* HEADER */}
                <header className='absolute top-0 left-0 w-full h-18 bg-white z-10 border-b border-gray-200 flex items-center justify-center md:hidden'>
                    <div className='flex items-center w-full h-18 px-6'>
                        {back && (
                            <button
                                className='btn-stroke btn-square btn-medium shrink-0 mr-6 2xl:mr-4 md:!w-6 md:h-6 md:mr-3'
                                onClick={() => router.back()}
                            >
                                <Icon name='arrow-prev' />
                            </button>
                        )}
                        <h1 className='mr-4 text-h3 truncate'>
                            {title || 'Chat'}
                        </h1>
                        <div className='flex items-center shrink-0 ml-auto'>
                            <button className='btn-transparent-dark btn-square btn-medium mr-2'>
                                <Icon name='search' />
                            </button>
                            <button className='btn-transparent-dark btn-square btn-medium relative'>
                                <Icon name='notification' />
                                <div className='absolute top-1.5 right-[0.5625rem] w-2 h-2 border border-white rounded-full bg-green-1'></div>
                            </button>
                            <button className='relative hidden w-8 h-8 ml-1 md:block'>
                                <Image
                                    className='rounded-full object-cover'
                                    src='/images/avatars/avatar.jpeg'
                                    fill
                                    alt='Avatar'
                                />
                            </button>
                        </div>
                    </div>
                </header>

                {/* USER INFO */}
                <div className='flex items-center'>
                    <div>
                        <div className='relative w-38 h-38 '>
                            <Image
                                className='rounded-full object-cover'
                                src='/images/avatars/avatar.jpeg'
                                fill
                                alt='Avatar'
                            />
                        </div>
                        <div className='flex text-h3 items-center'>
                            {userStore && userStore.name}
                            <div className='label-stroke ml-2'>Designer</div>
                        </div>
                        <div className='text-sm mb-2'>
                            {userStore && userStore.email}
                        </div>
                    </div>
                </div>

                <div className='flex shrink-0 w-[30rem] 4xl:w-[14.75rem] gap-2 mb-6'>
                    <button className='btn-purple btn-medium grow'>
                        <Icon name='check' />
                        <span>Start Chat</span>
                    </button>
                    <button className='btn-purple btn-medium btn-square shrink-0 '>
                        <Icon name='email' />
                    </button>
                    <button
                        className='btn-purple btn-medium btn-square'
                        onClick={() => {
                            pb.realtime.unsubscribe();
                            pb.authStore.clear();
                            router.push('/');
                        }}
                    >
                        <Icon name='arrow-up-right' />
                    </button>
                </div>

                {/* CHAT INPUT */}
                <div className='flex lg:flex-col-reverse'>
                    <div className='flex-grow mr-30'>
                        <Comment
                            className='mb-6'
                            avatar='/images/avatars/avatar.jpeg'
                            placeholder='Type to add something'
                            value={value}
                            setValue={(e) => setValue(e.target.value)}
                            posts={posts}
                            submitFunc={submitPost}
                        />
                    </div>
                </div>
            </div>

            {/* SIDEBAR */}
            <div className='shrink-0 w-[25%] min-w-[22rem] lg:w-full'>
                {/* TEAM MEMBERS */}
                <div className='mb-8'>
                    <div className='mb-5'>
                        <div className='mb-3 text-h6'>Team members</div>
                        <div className='flex items-center'>
                            {teammembers.map((member, index) => (
                                <div className='relative w-9 h-9' key={index}>
                                    <Image
                                        className='object-cover rounded-full'
                                        src={member}
                                        fill
                                        alt='Avatar'
                                    />
                                </div>
                            ))}
                            <button className='btn-transparent-dark btn-square btn-small'>
                                <Icon name='add-circle' />
                            </button>
                        </div>
                    </div>

                    {/* SHARED MOMENTS */}
                    <div className='mb-8'>
                        <div className='mb-3 text-h6'>Shared Moments</div>
                        <div className='flex flex-wrap -mt-2 mx-1'>
                            {images.map((image, index) => (
                                <div
                                    className='w-[calc(50%-0.5rem)] mt-2 border border-n-1'
                                    key={index}
                                >
                                    <Image
                                        className='object-cover w-full h-full'
                                        src={image}
                                        width={500}
                                        height={500}
                                        alt='Avatar'
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className='mb-8'>
                        <div className='mb-3 text-h6'>Latest media</div>
                        <div className='flex flex-wrap -mt-2 mx-1'>
                            {images.map((image, index) => (
                                <div
                                    className='w-[calc(50%-0.5rem)] mt-2 border border-n-1'
                                    key={index}
                                >
                                    <Image
                                        className='object-cover'
                                        src={image}
                                        width={500}
                                        height={500}
                                        alt='Avatar'
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className='mb-8'>
                        <div className='mb-3 text-h6'>File Library</div>
                        <div className='flex flex-wrap -mt-2 mx-1'>
                            {images.map((image, index) => (
                                <div
                                    className='w-[calc(50%-0.5rem)] mt-2 border border-n-1'
                                    key={index}
                                >
                                    <Image
                                        className='object-cover'
                                        src={image}
                                        width={500}
                                        height={500}
                                        alt='Avatar'
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* SKILLS & BADGES */}
                    <div>
                        <div className='mb-3 text-h6'>Skills & Expertise</div>
                        <div className='flex flex-wrap -mt-1.5'>
                            {skills.map((skill, index) => (
                                <div
                                    className='label-stroke mt-1.5'
                                    key={index}
                                >
                                    {skill}
                                </div>
                            ))}
                        </div>
                        <div className='mb-3 text-h6 mt-8'>
                            Achievements & Badges
                        </div>
                        <div className='flex flex-wrap -mt-1.5'>
                            {skills.map((skill, index) => (
                                <div
                                    className='label-stroke mt-1.5'
                                    key={index}
                                >
                                    {skill}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
