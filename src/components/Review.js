import Icon from '@/components/Icon';
import Comment from '@/components/Comment';
import Replies from '@/components/Replies';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { pb } from '@/app/lib/pocketbase';
import { useUserStore } from '@/store/store';

const Review = ({ comments, likes, messageId, children }) => {
    const [visible, setVisible] = useState(false);
    const [value, setValue] = useState('');
    const [replies, setReplies] = useState([]);
    const userStore = useUserStore((state) => state.authUser);
    const isSubscribed = useRef(false);
    const hasFetchedLikes = useRef(false);
    const [currentLikes, setCurrentLikes] = useState(likes);
    const [liked, setLiked] = useState(false);

    function msToTime(ms) {
        let seconds = (ms / 1000).toFixed(1);
        let minutes = (ms / (1000 * 60)).toFixed(1);
        let hours = (ms / (1000 * 60 * 60)).toFixed(1);
        let days = (ms / (1000 * 60 * 60 * 24)).toFixed(1);

        if (seconds < 60) return seconds + ' secs ago';
        else if (minutes < 60) return minutes + ' minutes ago';
        else if (hours < 24) return Math.round(hours) + ' hours ago';
        else return Math.round(days) + ' days ago';
    }

    const handleLike = async () => {
        if (liked) return; // Prevent multiple likes

        try {
            const response = await fetch(
                `http://localhost:3000/api/likes?messageId=${messageId}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        message: messageId,
                        user: userStore.id,
                        likes: 0,
                    }),
                }
            );
            const data = await response.json();
            if (!data.error) {
                setCurrentLikes((prev) => prev + 1);
                setLiked(true); //Disable further clicks
            }
        } catch (error) {
            console.error('Error liking the message:', error);
        }
    };

    const fetchLikes = useCallback(async () => {
        if (hasFetchedLikes.current) return; // Prevent duplicate fetch
        try {
            const response = await fetch(
                `http://localhost:3000/api/likes?messageId=${messageId}&userId=${userStore.id}`
            );
            const data = await response.json();
            if (data.liked) {
                setLiked(true); // User has already liked this message
            }
        } catch (error) {
            console.error('Error fetching likes:', error);
        }
    }, [messageId, userStore.id]);
    useEffect(() => {
        fetchLikes();
        hasFetchedLikes.current = true;
    }, [fetchLikes]);

    const fetchReplies = useCallback(async () => {
        try {
            const response = await fetch(
                `http://localhost:3000/api/replies?messageId=${messageId}`
            );
            const data = await response.json();
            setReplies(data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    }, [messageId]);

    const submitReply = async () => {
        if (!value.trim()) return; // Prevent empty replies
        try {
            const response = await fetch('http://localhost:3000/api/replies', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: messageId, // Associate reply with the correct message
                    content: value,
                    user: userStore.id,
                    likes: 0,
                }),
            });
            setValue(''); // Clear input field
        } catch (error) {
            console.error('Error submitting reply:', error);
        }
    };

    useEffect(() => {
        if (visible) {
            fetchReplies();
        } else {
            setReplies([]);
        }
    }, [fetchReplies, visible]);

    useEffect(() => {
        if (isSubscribed.current) return; // Prevent duplicate subscriptions
        isSubscribed.current = true;
        //Subscribe to real time messages
        const unsubscribe = pb.collection('replies').subscribe(
            '*',
            ({ record, action }) => {
                if (action === 'create') {
                    setReplies((prev) => [record, ...prev]);
                }
            },
            {
                sort: '-created',
                expand: 'user',
                filter: `message = "${messageId}"`,
            }
        );

        return () => {
            unsubscribe.then((unsub) => unsub()); // Cleanup subscription on unmount
            isSubscribed.current = false;
        };
    }, [messageId]);

    // Real-Time Likes Subscription
    useEffect(() => {
        if (isSubscribed.current) return; // Prevent duplicate subscriptions
        isSubscribed.current = true;

        const unsubscribe = pb
            .collection('messages')
            .subscribe(messageId, ({ record, action }) => {
                if (action === 'update' && record.likes !== currentLikes) {
                    setCurrentLikes(record.likes); // Update likes in real-time
                }
            });

        return () => {
            unsubscribe.then((unsub) => unsub()); // Cleanup on unmount
            isSubscribed.current = false;
        };
    }, []);

    return (
        <div className='flex mb-4 p-5 pb-3 card last:mb-0'>
            <div className='w-[calc(100%-2.125rem)] pl-3.5'>
                <div className='flex'>
                    <div className='mt-4  dark:border-white'>{children}</div>
                    <div className='whitespace-nowrap text-sm font-bold'> </div>
                    <div className='ml-2 pt-0.75 truncate text-xs font-medium text-n-3 dark:text-white/75'></div>
                </div>
                <div className='flex mt-3'>
                    <button
                        className={`btn-transparent-dark btn-small px-0 ${
                            liked ? 'disabled' : ''
                        }`}
                        onClick={handleLike}
                        disabled={liked}
                    >
                        <Icon
                            name='like'
                            className={liked ? '!fill-purple-1' : ''}
                        />
                        <span>{currentLikes}</span>
                    </button>

                    <button className='btn-transparent-dark btn-small ml-5 px-0'>
                        <Icon name='sun' />
                        <span>{comments}</span>
                    </button>

                    <button
                        className={`btn-transparent-dark btn-square btn-small ml-auto -mr-2 ${
                            visible ? '!fill-purple-1' : ''
                        }`}
                        onClick={() => setVisible(!visible)}
                    >
                        <Icon name='reply' />
                    </button>
                </div>
                {visible && (
                    <Comment
                        className='mt-4 mb-2 !pr-4 !py-0 !pl-0 border-dashed shadow-none md:-ml-12 md:!pr-3'
                        placeholder='Type to add your comment'
                        value={value}
                        setValue={(e) => setValue(e.target.value)}
                        submitFunc={submitReply}
                    />
                )}
                {replies.length > 0 && visible && (
                    <div className='mt-4'>
                        {replies.map((reply, i) => (
                            <Replies
                                key={i}
                                avatar='/images/avatars/avatar.jpeg'
                                className='mb-3'
                            >
                                <div className='ml-2 flex flex-col'>
                                    <div className='flex justify-between items-center gap-4'>
                                        <span className='text-sm font-bold text-n-1 dark:text-white '>
                                            {reply.expand.user.name}
                                        </span>
                                        <span className='text-xs text-n-3 dark:text-white'>
                                            {msToTime(
                                                Math.abs(
                                                    new Date() -
                                                        new Date(reply.created)
                                                )
                                            )}
                                        </span>
                                    </div>
                                    <div>{reply.content}</div>
                                </div>
                            </Replies>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Review;
