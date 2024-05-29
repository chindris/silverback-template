export const onRequest: PagesFunction = async (context) => {
  const drupalExternalUrl =
    // @ts-ignore
    context.env.DRUPAL_EXTERNAL_URL || 'http://localhost:8888';
  return fetch(`${drupalExternalUrl}${context.functionPath}`, context.request);
};
