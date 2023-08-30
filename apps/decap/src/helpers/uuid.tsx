import { nanoid } from 'nanoid';
import { CmsWidgetControlProps } from 'netlify-cms-core';
import React from 'react';

// Reusable UUID widget for Decap CMS.
// Auto-generates a UUID on creation and does not allow to change it.
// TODO: extract to shared package?
export const UuidWidget = React.forwardRef(function UuidWidget({
  value,
  onChange,
  forID,
}: CmsWidgetControlProps) {
  React.useEffect(() => {
    if (!value) {
      onChange(nanoid());
    }
  }, [value, onChange]);
  return (
    <span id={forID} style={{ fontFamily: 'monospace', marginLeft: '1rem' }}>
      {value}
    </span>
  );
});
