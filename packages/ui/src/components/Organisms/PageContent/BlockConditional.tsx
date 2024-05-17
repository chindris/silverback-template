import { BlockConditionalFragment } from '@custom/schema';
import React, { useEffect, useState } from 'react';

import { isTruthy } from '../../../utils/isTruthy';
import { UnreachableCaseError } from '../../../utils/unreachable-case-error';
import { BlockAccordion } from './BlockAccordion';
import { BlockCta } from './BlockCta';
import { BlockForm } from './BlockForm';
import { BlockHorizontalSeparator } from './BlockHorizontalSeparator';
import { BlockMarkup } from './BlockMarkup';
import { BlockMedia } from './BlockMedia';
import { BlockQuote } from './BlockQuote';

export function BlockConditional(props: BlockConditionalFragment) {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const visible = {
      scheduledDisplay: [
        props.displayFrom
          ? new Date(props.displayFrom).getTime() <= new Date().getTime()
          : true,
        props.displayTo
          ? new Date(props.displayTo).getTime() > new Date().getTime()
          : true,
      ].every(Boolean),
    };
    setIsVisible(Object.values(visible).every(Boolean));
  }, []);

  return isVisible ? (
    <>
      {props.content?.filter(isTruthy).map((block, index) => {
        return <CommonContent key={index} {...block} />;
      })}
    </>
  ) : null;
}

type CommonContentBlock = NonNullable<
  Required<BlockConditionalFragment>['content'][number]
>;

export function CommonContent(props: CommonContentBlock) {
  switch (props.__typename) {
    case 'BlockMedia':
      return <BlockMedia {...props} />;
    case 'BlockMarkup':
      return <BlockMarkup {...props} />;
    case 'BlockForm':
      return <BlockForm {...props} />;
    case 'BlockImageTeasers':
      return (
        // TODO: Implement BlockImageTeasers
        <div
          style={{
            color: 'red',
            border: 'solid 3px red',
            padding: '3px',
            margin: '5px 0',
          }}
          // eslint-disable-next-line react/jsx-no-literals
        >
          BlockImageTeasers goes here
        </div>
      );
    case 'BlockCta':
      return <BlockCta {...props} />;
    case 'BlockImageWithText':
      return (
        // TODO: Implement BlockImageWithText
        <div
          style={{
            color: 'red',
            border: 'solid 3px red',
            padding: '3px',
            margin: '5px 0',
          }}
          // eslint-disable-next-line react/jsx-no-literals
        >
          BlockImageWithText goes here
        </div>
      );
    case 'BlockQuote':
      return <BlockQuote {...props} />;
    case 'BlockHorizontalSeparator':
      return <BlockHorizontalSeparator />;
    case 'BlockAccordion':
      return <BlockAccordion {...props} />;
    default:
      throw new UnreachableCaseError(props);
  }
}
