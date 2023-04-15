export function websiteUrl(path: string): string {
  return `${
    process.env.PLAYWRIGHT_WEBSITE_URL || 'http://localhost:8000'
  }${path}`;
}

export function cmsUrl(path: string): string {
  return `${process.env.PLAYWRIGHT_CMS_URL || 'http://localhost:8888'}${path}`;
}
