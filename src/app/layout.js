'use client';
import { Geist, Geist_Mono } from 'next/font/google';
import { useEffect } from 'react';
import { pb } from './lib/pocketbase';
import { useUserStore } from '@/store/store';
import './globals.css';
import { useRouter } from 'next/navigation';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export default function RootLayout({ children }) {
    const setUser = useUserStore((state) => state.setAuthUser);
    const router = useRouter();
    const verifyAuth = async (token) => {
        try {
            // Assign token to PocketBase client
            pb.authStore.save(token, pb.authStore.user);

            // Verify token is still valid
            const isValid = await pb.collection('users').authRefresh();

            return isValid;
        } catch (error) {
            console.error('Token invalid or expired:', error);
            return false;
        }
    };

    useEffect(() => {
        const cookie = document.cookie;

        if (!cookie) {
            console.log('No cookie found');
            router.push('/');
        } else {
            if (cookie.includes('auth=')) {
                const authToken = cookie
                    .split(';')
                    .find((c) => c.includes('auth'))
                    .split('=')[1];
                console.log('cookie', authToken);
                verifyAuth(authToken).then((res) => {
                    if (res) {
                        setUser(res.record);
                        return true;
                    }
                });
            } else {
                router.push('/');
            }
        }
    }, [setUser]);
    return (
        <html lang='en'>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                {children}
            </body>
        </html>
    );
}
