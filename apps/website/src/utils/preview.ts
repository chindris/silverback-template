import { useEffect, useState } from 'react';

export function usePreviewParameters() {
  const [search, setState] = useState('');
  useEffect(() => {
    setState(window.location.search);
  }, [setState]);

  const args = new URLSearchParams(search);
  const nid = args.get('nid');
  const rid = args.get('rid');
  const lang = args.get('lang');
  return { nid, rid, lang };
}
