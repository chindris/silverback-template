import '@custom/ui/styles.css';

import { Frame } from '@custom/ui/routes/Frame';
import type { PropsWithChildren } from 'react';

import { DrupalExecutor } from '../components/executor';

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <DrupalExecutor>
      <Frame>{children}</Frame>
    </DrupalExecutor>
  );
}

export const getConfig = async () => {
  return {
    render: 'static',
  };
};
