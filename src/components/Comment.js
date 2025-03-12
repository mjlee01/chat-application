import TextareaAutosize from 'react-textarea-autosize';
import Icon from '@/components/Icon';
import Image from '@/components/Image';
import Review from './Review';

const Comment = ({
    className,
    avatar,
    placeholder,
    value,
    setValue,
    posts,
    submitFunc,
}) => {
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

    return (
        <>
            <form
                className={`flex pl-1 py-1 pr-5 bg-white border border-n-1 shadow-primary-4 md:pr-4 dark:bg-n-1 dark:border-white ${className}`}
                onSubmit={() => console.log('Submit')}
            >
                {avatar && (
                    <div className='relative self-center w-8.5 h-8.5 ml-2'>
                        <Image
                            className='object-cover rounded-full'
                            src={avatar}
                            fill
                            alt='Avatar'
                        />
                    </div>
                )}
                <TextareaAutosize
                    className='grow self-center py-2 px-4 bg-transparent text-sm font-medium text-n-1 outline-none resize-none placeholder:text-n-1 md:px-3 dark:text-white dark:placeholder:text-white'
                    maxRows={5}
                    autoFocus
                    value={value}
                    onChange={setValue}
                    placeholder={placeholder}
                    required
                />
                <div className='flex items-center shrink-0 h-[3.375rem]'>
                    <button
                        className='btn-transparent-dark btn-square btn-small mr-1 md:hidden'
                        type='button'
                    >
                        <Icon name='smile' />
                    </button>
                    <button
                        className='btn-transparent-dark btn-square btn-small mr-3 md:hidden'
                        type='button'
                    >
                        <Icon name='plus' />
                    </button>
                    <button
                        className='btn-purple btn-square btn-small'
                        type='button'
                        onClick={submitFunc}
                    >
                        <Icon name='send' />
                    </button>
                </div>
            </form>
            <div className='grid items-center'>
                {posts &&
                    posts.map((post) => (
                        <Review
                            key={post.id}
                            item={posts}
                            imageBig={false}
                            likes={post.likes}
                            messageId={post.id}
                        >
                            <div className='pb-2 flex flex-col items-center'>
                                <div className='w-full flex'>
                                    <div className='relative self-center w-8.5 h-8.5'>
                                        <Image
                                            className='object-cover rounded-full'
                                            src={avatar}
                                            fill
                                            alt='Avatar'
                                        />
                                    </div>
                                    <div className='ml-2 flex flex-col'>
                                        <div className='flex justify-between items-center gap-4'>
                                            <span className='text-sm font-bold text-n-1 dark:text-white '>
                                                {post.expand.user.name}
                                            </span>
                                            <span className='text-xs text-n-3 dark:text-white'>
                                                {msToTime(
                                                    Math.abs(
                                                        new Date() -
                                                            new Date(
                                                                post.created
                                                            )
                                                    )
                                                )}
                                            </span>
                                        </div>
                                        <div>{post.content}</div>
                                    </div>
                                </div>
                            </div>
                        </Review>
                    ))}
            </div>
        </>
    );
};

export default Comment;
