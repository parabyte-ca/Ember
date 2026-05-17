import type { Metadata } from 'next';
import '@fontsource/inter/variable.css';
import '@fontsource/fraunces/variable.css';
import '../globals.css';
import { APP_NAME } from '@ember/lib';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';

export const metadata: Metadata = {
  title: APP_NAME,
  description: 'Deepen your connection, one question at a time.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="bg-background font-sans antialiased">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
