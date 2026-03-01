import type {Metadata} from 'next';
import { Playfair_Display, DM_Mono } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['700', '900'],
  variable: '--font-playfair',
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'StudyBoard | Premium Q&A Platform',
  description: 'A community-driven Q&A platform for students with a premium editorial feel.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmMono.variable}`}>
      <body suppressHydrationWarning className="bg-[#FAF9F6] text-[#111111] font-serif selection:bg-[#D97706] selection:text-white">
        {children}
      </body>
    </html>
  );
}
