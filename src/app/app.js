import '@/styles/globals.css';
import { Roboto_Flex } from 'next/font/google';
import { ColorModeScript, ColorModeProvider } from '@/components/ui/color-mode';

const roboto = Roboto_Flex({
    weight: ['400', '500', '700', '800'],
    subsets: ['latin'],
    display: 'block',
    variable: '--font-roboto',
});

export default function App({ Component, pageProps }) {

    return (
        <main className={`${roboto.variable} font-sans`}>
            <style jsx global>{`
                html {
                    font-family: ${roboto.style.fontFamily};
                }
            `}</style>
            <ColorModeProvider>
                <ColorModeScript
                    initialColorMode='system'
                    key='chakra-ui-no-flash'
                    storageKey='chakra-ui-color-mode'
                />
                <Component {...pageProps} />
            </ColorModeProvider>
        </main>
    );
}
