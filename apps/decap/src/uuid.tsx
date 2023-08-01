import { nanoid } from 'nanoid';
import { CmsWidgetControlProps } from 'netlify-cms-core';
import { useEffect } from 'react';

// TODO: extract to shared package?
export function UuidWidget({ value, onChange, forID }: CmsWidgetControlProps) {
  useEffect(() => {
    if (!value) {
      onChange(nanoid());
    }
  }, [value, onChange]);
  return (
    <span id={forID} style={{ fontFamily: 'monospace', marginLeft: '1rem' }}>
      {value}
    </span>
  );
}
