import type { Metadata } from 'next';
import { Noto_Sans_KR, Playfair_Display } from 'next/font/google';
import './globals.css';

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Buen Camino! - 포르투갈·스페인 25일 여행 대시보드',
  description: '카미노 데 산티아고 포르투게스 루트 + 스페인 여행 계획',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${notoSansKR.variable} ${playfairDisplay.variable}`}>
        {children}
      </body>
    </html>
  );
}
