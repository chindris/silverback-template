import Negotiator from 'https://deno.land/x/negotiator@1.0.1/mod.ts';
import { Config } from 'https://edge.netlify.com';

// Configure the available languages and the default language.
// TODO: Infer this automatically from the available locales.
const availableLanguages = ['en', 'de'];
const defaultLanguage = 'en';

export default (request: Request) => {
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

export const config = { path: '/' } satisfies Config;
