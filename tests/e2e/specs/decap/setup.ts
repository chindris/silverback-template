import { test as setup } from '@playwright/test';

import {
  netlifyBootTimeout,
  waitForNetlifyBoot,
} from '../../helpers/wait-for-netlify-boot';

setup.setTimeout(netlifyBootTimeout + 10_000);

setup('setup', async ({ page }) => {
  await waitForNetlifyBoot(page);
});
