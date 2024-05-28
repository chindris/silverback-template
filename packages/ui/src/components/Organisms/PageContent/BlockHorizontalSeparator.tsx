import React from 'react';

import { FadeUp } from '../../Molecules/FadeUp';

export function BlockHorizontalSeparator() {
  return (
    <FadeUp yGap={50}>
      <div className="container-page">
        <div className="container-content">
          <hr className="container-text my-8 text-gray-200" />
        </div>
      </div>
    </FadeUp>
  );
}
