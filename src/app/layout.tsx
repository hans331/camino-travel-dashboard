import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '🐚 Walk Camino Together · 카미노 + 캠브리지 + 파리·베르사유',
  description: '포르토 → 카미노 포르투게스 → 산티아고 → 런던·캠브리지 → 파리·베르사유 21일 여행 계획',
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
