// Broken Gatsby links will attempt to load page-data.json files, which don't exist
// and also should not be piped into the strangler function. Thats why they
// are caught right here.
export const onRequestGet: PagesFunction = async () => {
  return new Response('Not found', { status: 404 });
};
