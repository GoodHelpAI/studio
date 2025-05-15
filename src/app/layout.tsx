
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
// import { GeistMono } from 'geist/font/mono'; // Removed as per previous fix if not installed
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Cudd Realty Measurement Form',
  description: 'Streamlined property listing measurement input',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          GeistSans.variable,
          // GeistMono.variable // Ensure geist is installed if you re-enable this
        )}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
