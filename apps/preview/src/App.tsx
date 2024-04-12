import { OperationExecutor } from '@custom/schema';
import { Frame } from '@custom/ui/routes/Frame';
import { Preview, usePreviewRefresh } from '@custom/ui/routes/Preview';
import { useEffect } from 'react';
import { webSocket } from 'rxjs/webSocket';

import { drupalExecutor } from './drupal-executor';

declare global {
  interface Window {
    GRAPHQL_ENDPOINT: string;
  }
}

const updates$ = webSocket({
  url: `${window.location.origin.replace('http', 'ws')}/__preview`,
});

function App() {
  const refresh = usePreviewRefresh();
  useEffect(() => {
    const sub = updates$.subscribe(refresh);
    return sub.unsubscribe;
  }, [refresh]);
  return (
    <OperationExecutor
      executor={drupalExecutor(window.GRAPHQL_ENDPOINT, false)}
    >
      <Frame>
        <Preview />
      </Frame>
    </OperationExecutor>
  );
}

export default App;
