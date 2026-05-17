import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';
import { resolveLocale, SUPPORTED_LOCALES } from '@ember/lib';

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get('locale')?.value;
  const locale = resolveLocale(localeCookie);
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
