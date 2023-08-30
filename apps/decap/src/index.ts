import { PageSource } from '@custom/schema/source';
import fs from 'fs';
import { dirname, resolve } from 'path';
import yaml from 'yaml';

import { pageSchema } from './collections/page';

export function getPages() {
  const dir = resolve(dirname(new URL(import.meta.url).pathname), '../data');
  const settings = yaml.parse(fs.readFileSync(`${dir}/site.yml`, 'utf-8')) as {
    homePage: string;
    notFoundPage: string;
  };
  const pages: Array<PageSource> = [];
  fs.readdirSync(`${dir}/page`)
    .filter((file) => file.endsWith('.yml'))
    .forEach((file) => {
      const content = yaml.parse(
        fs.readFileSync(`${dir}/page/${file}`, 'utf-8'),
      );
      Object.keys(content).forEach((lang) => {
        const input = {
          ...content[lang],
          locale: lang,
          path:
            content[lang].path === settings.homePage
              ? '/'
              : content[lang].path === settings.notFoundPage
              ? '/404'
              : content[lang].path,
        };
        const page = pageSchema.safeParse(input);
        if (page.success) {
          pages.push(page.data);
        } else {
          console.warn(`Error parsing ${file} (${lang}):`);
          console.warn(page.error.message);
        }
      });
    });
  return pages;
}
