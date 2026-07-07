import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '🐚 Walk Camino Together · 카미노 + 스위스 + 캠브리지 + 파리',
  description: '포르토 → 카미노(10일) → 산티아고 → 🇨🇭 스위스 알프스 6일 (Lucerne·Matterhorn·융프라우요호) → 캠브리지 → 파리(8일) 28일 가족 여행',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#16A34A',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        {children}
      </body>
    </html>
  );
}
