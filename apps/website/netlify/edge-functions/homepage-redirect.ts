// @ts-ignore
import Negotiator from 'https://deno.land/x/negotiator/mod.ts';

// Configure the available languages and the default language.
// TODO: Infer this automatically from the available locales.
const availableLanguages = ['en', 'de'];
const defaultLanguage = 'en';

// @ts-ignore
export default (request) => {
  const preferredLanguage =
    new Negotiator(request.headers).language(availableLanguages) ||
    defaultLanguage;
  return new Response(null, {
    status: 302,
    headers: {
      location: `/${preferredLanguage}`,
    },
  });
};

export const config = { path: '/' };
