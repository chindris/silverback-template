export const onRequestGet: PagesFunction = async (context) => {
  const availableLanguages = ['en', 'fr'];
  const defaultLanguage = 'en';
  const currentLanguage = context.request.headers
    .get('accept-language')
    ?.substring(0, 2);
  let preferredLanguage = defaultLanguage;
  if (currentLanguage && availableLanguages.includes(currentLanguage)) {
    preferredLanguage = currentLanguage;
  }
  const statusCode = 302;
  const url = new URL(context.request.url);
  url.pathname = `/${preferredLanguage}/`;
  return Response.redirect(url.toString(), statusCode);
};
