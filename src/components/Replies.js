import Image from '@/components/Image';

const Comment = ({
    className,
    avatar,
    children,
}) => {
    
    return (
        <>
            <div
                className={`flex pl-1 py-1 pr-5 bg-white border border-n-1 md:pr-4 dark:bg-n-1 dark:border-white ${className}`}
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
                {children}
            </div>
        </>
    );
};

export default Comment;
