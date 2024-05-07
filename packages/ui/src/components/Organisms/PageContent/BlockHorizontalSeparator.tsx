import React from 'react';

import { FadeUp } from '../../Molecules/FadeUp';

export function BlockHorizontalSeparator() {
  return (
    <FadeUp yGap={50} className="container-page my-8">
      <div className="container-content">
        <hr className="container-text text-gray-200" />
      </div>
    </FadeUp>
  );
}
