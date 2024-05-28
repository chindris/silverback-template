import React from 'react';

import { FadeUp } from '../../Molecules/FadeUp';

export function BlockHorizontalSeparator() {
  return (
    <FadeUp yGap={50}>
      <div className="container-page my-8">
        <div className="container-content">
          <hr className="container-text my-8 text-gray-200" />
        </div>
      </div>
    </FadeUp>
  );
}
