import { SilverbackIframe } from '@amazeelabs/silverback-iframe';
import { BlockFormFragment, Url, useLocation } from '@custom/schema';
import clsx from 'clsx';
import React from 'react';

import { buildMessages, storeMessages } from '../../Molecules/Messages';

export function BlockForm(
  props: BlockFormFragment & {
    className?: string;
    // For Storybook.
    cssStylesToInject?: string;
  },
) {
  const [, navigate] = useLocation();

  if (!props.url) {
    return null;
  }

  return (
    <div className={clsx('container-content', props.className)}>
      <SilverbackIframe
        src={props.url}
        buildMessages={buildMessages}
        redirect={(url, messages) => {
          if (messages) {
            storeMessages(messages);
          }
          navigate(url as Url);
        }}
        style={{
          width: '1px',
          minWidth: '100%',
        }}
        heightCalculationMethod="lowestElement"
        cssStylesToInject={props.cssStylesToInject}
      />
    </div>
  );
}
