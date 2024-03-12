export async function githubProxy(
  request: Request,
  token: string,
  basePath: string,
) {
  const url = new URL(request.url);
  const path = url.pathname.replace(basePath, '');
  const response = await fetch('https://api.github.com' + path, {
    method: request.method,
    body: request.body,
    // @ts-ignore: "duplex" is not in the RequestInit type yet.
    duplex: 'half',
    headers: {
      ...request.headers,
      Authorization: `Bearer ${token}`,
    },
  });
  const header = new Headers(response.headers);
  header.delete('content-encoding');
  header.delete('content-length');
  const content = (await response.text()).replace(
    /https:\/\/api\.github\.com/g,
    url.protocol + '//' + url.host + basePath,
  );
  return new Response(content, {
    status: response.status,
    headers: header,
  });
}
