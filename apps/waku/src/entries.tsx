import { Page } from '@custom/ui/routes/Page';
import { createPages } from 'waku';

export default createPages(async ({ createPage, createLayout }) => {
  // createLayout({
  //   render: 'static',
  //   path: '/',
  //   component: RootLayout,
  // });

  createPage({
    render: 'static',
    path: '/',
    component: Page,
  });
});
