export function websiteUrl(path: string): string {
  return `${
    process.env.PLAYWRIGHT_WEBSITE_URL || 'http://127.0.0.1:8000'
  }${path}`;
}

export function cmsUrl(path: string): string {
  return `${process.env.PLAYWRIGHT_CMS_URL || 'http://127.0.0.1:8888'}${path}`;
}
